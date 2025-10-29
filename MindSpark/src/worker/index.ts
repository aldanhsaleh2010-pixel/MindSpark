import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: (origin) => origin || "*",
  credentials: true,
}));

// Authentication routes
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: (c.env as any).MOCHA_USERS_SERVICE_API_URL,
    apiKey: (c.env as any).MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: (c.env as any).MOCHA_USERS_SERVICE_API_URL,
    apiKey: (c.env as any).MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: (c.env as any).MOCHA_USERS_SERVICE_API_URL,
      apiKey: (c.env as any).MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// User profile routes
app.get("/api/profile", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user.id).first();

  if (!profile) {
    // Create default profile
    await c.env.DB.prepare(
      "INSERT INTO user_profiles (user_id, name, points, level) VALUES (?, ?, ?, ?)"
    ).bind(user.id, user.google_user_data.name || user.email, 0, 1).run();
    
    const newProfile = await c.env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).first();
    
    return c.json(newProfile);
  }

  return c.json(profile);
});

app.put("/api/profile", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  
  await c.env.DB.prepare(
    "UPDATE user_profiles SET name = ?, timezone = ?, notifications_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
  ).bind(body.name, body.timezone, body.notifications_enabled, user.id).run();

  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user.id).first();

  return c.json(profile);
});

// Class schedule routes
app.get("/api/schedule", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM class_schedules WHERE user_id = ? AND is_active = 1 ORDER BY day_of_week, start_time"
  ).bind(user.id).all();

  return c.json(results);
});

app.post("/api/schedule", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  
  const result = await c.env.DB.prepare(
    "INSERT INTO class_schedules (user_id, class_name, day_of_week, start_time, end_time, location) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(user.id, body.class_name, body.day_of_week, body.start_time, body.end_time, body.location).run();

  const newClass = await c.env.DB.prepare(
    "SELECT * FROM class_schedules WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return c.json(newClass);
});

app.delete("/api/schedule/:id", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  
  await c.env.DB.prepare(
    "UPDATE class_schedules SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
  ).bind(id, user.id).run();

  return c.json({ success: true });
});

// User interests routes
app.get("/api/interests", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM user_interests WHERE user_id = ? ORDER BY interest_type"
  ).bind(user.id).all();

  return c.json(results);
});

app.post("/api/interests", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  
  // Clear existing interests
  await c.env.DB.prepare(
    "DELETE FROM user_interests WHERE user_id = ?"
  ).bind(user.id).run();

  // Insert new interests
  for (const interest of body.interests) {
    await c.env.DB.prepare(
      "INSERT INTO user_interests (user_id, interest_type, is_selected) VALUES (?, ?, ?)"
    ).bind(user.id, interest, true).run();
  }

  return c.json({ success: true });
});

// Activities routes
app.get("/api/activities/random", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  // Get user interests
  const { results: interests } = await c.env.DB.prepare(
    "SELECT interest_type FROM user_interests WHERE user_id = ? AND is_selected = 1"
  ).bind(user.id).all();

  let query = "SELECT * FROM activities";
  let params: any[] = [];

  if (interests.length > 0) {
    const interestTypes = interests.map((i: any) => i.interest_type);
    const placeholders = interestTypes.map(() => "?").join(",");
    query += ` WHERE activity_type IN (${placeholders})`;
    params = interestTypes;
  }

  query += " ORDER BY RANDOM() LIMIT 1";

  const activity = await c.env.DB.prepare(query).bind(...params).first();

  if (!activity) {
    return c.json({ error: "No activities found" }, 404);
  }

  return c.json(activity);
});

app.post("/api/activities/:id/submit", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const activityId = c.req.param("id");
  const body = await c.req.json();
  
  const activity = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ?"
  ).bind(activityId).first();

  if (!activity) {
    return c.json({ error: "Activity not found" }, 404);
  }

  if (!activity.answer) {
    return c.json({ error: "This activity does not have an answer to check" }, 400);
  }

  // Check if answer is correct (case-insensitive comparison)
  const userAnswer = body.answer.toLowerCase().trim();
  const correctAnswer = (activity.answer as string).toLowerCase().trim();
  const isCorrect = userAnswer === correctAnswer;

  // Record submission
  await c.env.DB.prepare(
    "INSERT INTO user_activity_submissions (user_id, activity_id, submitted_answer, is_correct) VALUES (?, ?, ?, ?)"
  ).bind(user.id, activityId, body.answer, isCorrect).run();

  return c.json({ 
    is_correct: isCorrect,
    correct_answer: activity.answer 
  });
});

app.post("/api/activities/:id/complete", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const activityId = c.req.param("id");
  const body = await c.req.json();
  
  const activity = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ?"
  ).bind(activityId).first();

  if (!activity) {
    return c.json({ error: "Activity not found" }, 404);
  }

  // Record completion
  await c.env.DB.prepare(
    "INSERT INTO user_activity_completions (user_id, activity_id, points_earned, time_spent, rating) VALUES (?, ?, ?, ?, ?)"
  ).bind(user.id, activityId, activity.points_reward, body.time_spent, body.rating).run();

  // Update user points
  await c.env.DB.prepare(
    "UPDATE user_profiles SET points = points + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
  ).bind(activity.points_reward, user.id).run();

  return c.json({ points_earned: activity.points_reward });
});

// Leaderboard and stats
app.get("/api/stats", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  const completions = await c.env.DB.prepare(
    "SELECT COUNT(*) as total_completions FROM user_activity_completions WHERE user_id = ?"
  ).bind(user.id).first();

  const profile = await c.env.DB.prepare(
    "SELECT points, level FROM user_profiles WHERE user_id = ?"
  ).bind(user.id).first();

  const badges = await c.env.DB.prepare(
    "SELECT COUNT(*) as total_badges FROM user_badges WHERE user_id = ?"
  ).bind(user.id).first();

  return c.json({
    total_completions: completions?.total_completions || 0,
    total_points: profile?.points || 0,
    current_level: profile?.level || 1,
    total_badges: badges?.total_badges || 0
  });
});

export default app;

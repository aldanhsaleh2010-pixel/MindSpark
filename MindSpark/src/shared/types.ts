import z from "zod";

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string().nullable(),
  timezone: z.string().default('UTC'),
  notifications_enabled: z.boolean().default(true),
  points: z.number().default(0),
  level: z.number().default(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Class Schedule Schema
export const ClassScheduleSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  class_name: z.string(),
  day_of_week: z.number().min(0).max(6), // 0-6 (Sunday-Saturday)
  start_time: z.string(), // HH:MM format
  end_time: z.string(), // HH:MM format
  location: z.string().nullable(),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ClassSchedule = z.infer<typeof ClassScheduleSchema>;

// Activity Schema
export const ActivitySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  activity_type: z.enum(['puzzle', 'story', 'math', 'brain_teaser', 'trivia', 'quote']),
  difficulty_level: z.number().min(1).max(5).default(1),
  estimated_duration: z.number().default(120), // seconds
  points_reward: z.number().default(10),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;

// User Interest Schema
export const UserInterestSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  interest_type: z.string(),
  is_selected: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserInterest = z.infer<typeof UserInterestSchema>;

// Badge Schema
export const BadgeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  requirement_type: z.string(),
  requirement_value: z.number(),
  points_reward: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Badge = z.infer<typeof BadgeSchema>;

// Activity Completion Schema
export const ActivityCompletionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  activity_id: z.number(),
  completed_at: z.string(),
  points_earned: z.number().default(0),
  time_spent: z.number().nullable(), // seconds
  rating: z.number().min(1).max(5).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ActivityCompletion = z.infer<typeof ActivityCompletionSchema>;

// API Request Schemas
export const CreateClassScheduleSchema = z.object({
  class_name: z.string().min(1, "Class name is required"),
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  location: z.string().optional(),
});

export type CreateClassScheduleRequest = z.infer<typeof CreateClassScheduleSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().optional(),
  timezone: z.string().optional(),
  notifications_enabled: z.boolean().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

export const SetInterestsSchema = z.object({
  interests: z.array(z.string()),
});

export type SetInterestsRequest = z.infer<typeof SetInterestsSchema>;

export const CompleteActivitySchema = z.object({
  time_spent: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export type CompleteActivityRequest = z.infer<typeof CompleteActivitySchema>;

// Available interest types
export const INTEREST_TYPES = [
  'puzzle',
  'story',
  'math',
  'brain_teaser',
  'trivia',
  'quote'
] as const;

export type InterestType = typeof INTEREST_TYPES[number];

// Days of the week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

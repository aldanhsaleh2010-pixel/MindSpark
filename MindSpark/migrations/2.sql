
ALTER TABLE activities ADD COLUMN answer TEXT;
ALTER TABLE activities ADD COLUMN answer_type TEXT DEFAULT 'text'; -- text, number, multiple_choice

CREATE TABLE user_activity_submissions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id TEXT NOT NULL,
activity_id INTEGER NOT NULL,
submitted_answer TEXT NOT NULL,
is_correct BOOLEAN DEFAULT false,
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

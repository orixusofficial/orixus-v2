-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL CHECK (category IN ('Bug Report', 'Feature Request', 'UI / UX', 'General Feedback')),
  message TEXT NOT NULL CHECK (length(message) > 0 AND length(message) <= 1000),
  allow_contact BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only view their own feedback
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin can view all feedback (assuming admin role exists)
CREATE POLICY "Admin can view all feedback" ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);

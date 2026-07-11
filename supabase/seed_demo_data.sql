-- Orixus Demo Data Seed Script
-- User ID: f15b2a75-292e-4bf1-936c-880e9352c7be
-- This script populates the demo account with realistic data

-- ---------------------------------------------------------------------------
-- 1. Update Profile
-- ---------------------------------------------------------------------------
INSERT INTO public.profiles (id, display_name, created_at)
VALUES (
  'f15b2a75-292e-4bf1-936c-880e9352c7be',
  'Demo User',
  '2024-01-15 10:30:00+00'
);

-- ---------------------------------------------------------------------------
-- 2. Insert 30 Habits
-- ---------------------------------------------------------------------------
INSERT INTO public.habits (id, user_id, label, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Morning Meditation', '2024-01-20 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440002', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Gym Workout', '2024-01-20 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440003', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Read 30 Minutes', '2024-01-21 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440004', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Drink 8 Glasses of Water', '2024-01-21 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440005', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'No Sugar', '2024-01-22 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440006', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Sleep 8 Hours', '2024-01-22 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440007', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Code for 1 Hour', '2024-01-23 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440008', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Walk 10,000 Steps', '2024-01-23 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440009', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Practice Guitar', '2024-01-24 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440010', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Write in Journal', '2024-01-24 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440011', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Eat Vegetables', '2024-01-25 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440012', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'No Social Media', '2024-01-25 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440013', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Stretch 10 Minutes', '2024-01-26 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440014', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Cold Shower', '2024-01-26 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440015', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Learn Spanish', '2024-01-27 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440016', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'No Caffeine After 2pm', '2024-01-27 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440017', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Floss Teeth', '2024-01-28 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440018', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Take Vitamins', '2024-01-28 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440019', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Read News', '2024-01-29 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440020', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Call Family', '2024-01-29 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440021', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Practice Deep Work', '2024-01-30 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440022', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'No Alcohol', '2024-01-30 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440023', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Meal Prep', '2024-01-31 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440024', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Declutter 5 Items', '2024-01-31 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440025', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Listen to Podcast', '2024-02-01 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440026', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Practice Gratitude', '2024-02-01 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440027', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'No Screens Before Bed', '2024-02-02 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440028', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Park Far Away', '2024-02-02 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440029', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Take Stairs', '2024-02-03 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440030', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Breathing Exercises', '2024-02-03 08:00:00+00');

-- ---------------------------------------------------------------------------
-- 3. Insert Habit Completions (90 days: April 1 - June 30, 2024)
-- Using generate_series for efficiency, with random misses for realism
-- ---------------------------------------------------------------------------
INSERT INTO public.habit_completions (id, user_id, habit_id, completed_on)
SELECT 
  gen_random_uuid(),
  'f15b2a75-292e-4bf1-936c-880e9352c7be',
  habit_id,
  completed_on
FROM (
  SELECT 
    '550e8400-e29b-41d4-a716-446655440001'::uuid as habit_id, 
    generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval) as completed_on
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440002'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440003'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440004'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440005'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440006'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440007'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440008'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440009'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440010'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440011'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440012'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440013'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440014'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440015'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440016'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440017'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440018'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440019'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440020'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440021'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440022'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440023'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440024'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440025'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440026'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440027'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440028'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440029'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
  UNION ALL
  SELECT '550e8400-e29b-41d4-a716-446655440030'::uuid, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval)
) dates
WHERE 
  -- Skip some random days for realism (about 10-15% miss rate)
  (extract(doy from completed_on) * 7 + extract(dow from completed_on)) % 11 != 0
  AND (extract(doy from completed_on) * 3 + extract(dow from completed_on)) % 13 != 0;

-- Add some specific missed days for more realism
DELETE FROM public.habit_completions 
WHERE user_id = 'f15b2a75-292e-4bf1-936c-880e9352c7be'
  AND completed_on IN (
    '2024-04-15', '2024-04-22', '2024-05-01', '2024-05-08', '2024-05-15',
    '2024-05-22', '2024-06-01', '2024-06-08', '2024-06-15', '2024-06-22'
  )
  AND random() < 0.3;

-- ---------------------------------------------------------------------------
-- 4. Insert 45 Journal Entries (spread across 3 months)
-- ---------------------------------------------------------------------------
INSERT INTO public.journal_entries (id, user_id, title, content, mood, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Starting Fresh', 'Today marks the beginning of my habit tracking journey. I feel motivated and ready to make positive changes in my life.', 'GOOD', '2024-04-02 09:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440002', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Morning Routine Success', 'Woke up at 6am and completed my meditation and gym session. Feeling energized for the day ahead.', 'EXCELLENT', '2024-04-05 08:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440003', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Struggled with Water Intake', 'Only managed 5 glasses of water today. Need to be more mindful about staying hydrated throughout the day.', 'NEUTRAL', '2024-04-08 20:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440004', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Productive Day', 'Completed all my habits including deep work session. The momentum is building up nicely.', 'EXCELLENT', '2024-04-12 19:20:00+00'),
  ('660e8400-e29b-41d4-a716-446655440005', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Social Media Detox', 'Managed to stay off social media for the entire day. My focus improved significantly.', 'GOOD', '2024-04-15 21:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440006', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Missed Gym Session', 'Had a busy day and couldn''t make it to the gym. Feeling a bit disappointed but will get back on track tomorrow.', 'NEUTRAL', '2024-04-18 22:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440007', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Reading Breakthrough', 'Finished my book today. The daily reading habit has been one of the most rewarding changes.', 'EXCELLENT', '2024-04-22 18:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440008', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Sleep Quality Improved', 'Been getting 8 hours of sleep consistently. My energy levels are much better now.', 'GOOD', '2024-04-25 07:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440009', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Weekend Reflection', 'Looking back at the week, I maintained most of my habits. The weekend was challenging but I stayed consistent.', 'GOOD', '2024-04-28 16:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440010', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'New Habit Added', 'Started practicing guitar today. It''s difficult but I enjoy the challenge.', 'NEUTRAL', '2024-05-02 20:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440011', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Sugar Cravings', 'Had a strong craving for sweets today but managed to resist. The no sugar habit is getting easier.', 'GOOD', '2024-05-05 14:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440012', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Coding Progress', 'Completed a small project today. The daily coding habit is really paying off.', 'EXCELLENT', '2024-05-08 17:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440013', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Step Count Goal', 'Hit 10,000 steps for the 5th day in a row. Walking has become a natural part of my routine.', 'EXCELLENT', '2024-05-12 19:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440014', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Meditation Benefits', 'Noticing reduced stress levels since starting daily meditation. My mind feels clearer.', 'GOOD', '2024-05-15 08:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440015', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Family Time', 'Called my parents today. The daily check-in habit has strengthened our relationship.', 'EXCELLENT', '2024-05-18 12:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440016', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Cold Shower Adaptation', 'Cold showers are becoming easier. The initial shock is worth the energy boost.', 'NEUTRAL', '2024-05-22 07:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440017', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Spanish Learning', 'Can now have basic conversations in Spanish. The daily practice is working.', 'GOOD', '2024-05-25 21:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440018', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Caffeine Experiment', 'Stopped caffeine after 2pm and my sleep quality has improved noticeably.', 'EXCELLENT', '2024-05-28 09:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440019', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Decluttering Progress', 'Removed 50 items from my home so far. The space feels much lighter.', 'GOOD', '2024-06-01 15:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440020', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Podcast Discovery', 'Found some amazing educational podcasts. They make my commute much more valuable.', 'EXCELLENT', '2024-06-04 08:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440021', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Gratitude Practice', 'Writing down 3 things I''m grateful for has shifted my perspective positively.', 'EXCELLENT', '2024-06-07 22:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440022', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Screen Time Challenge', 'No screens before bed for a week. My sleep has never been better.', 'GOOD', '2024-06-10 21:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440023', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Small Wins', 'Even on busy days, I managed to complete my core habits. Consistency is key.', 'GOOD', '2024-06-13 18:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440024', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Meal Prep Success', 'Prepped meals for the week. Eating healthy has become much easier.', 'EXCELLENT', '2024-06-16 14:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440025', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Stairs Habit', 'Taking stairs instead of elevators has become second nature.', 'GOOD', '2024-06-19 17:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440026', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Breathing Exercises', 'Deep breathing exercises help me stay calm during stressful situations.', 'EXCELLENT', '2024-06-22 10:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440027', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Mid-Journey Reflection', 'Two months in and I can see significant improvements in my daily routine and overall well-being.', 'EXCELLENT', '2024-06-25 20:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440028', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Habit Stacking', 'Started combining habits - meditation after stretching, reading before bed. This increases efficiency.', 'GOOD', '2024-04-10 19:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440029', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Accountability Partner', 'Shared my goals with a friend. Having someone check in helps me stay on track.', 'EXCELLENT', '2024-04-17 11:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440030', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Flexible Routine', 'Learned to adapt my habits to different situations. Rigidity was causing me to fail.', 'GOOD', '2024-04-24 16:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440031', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Tracking Benefits', 'Seeing my progress visually motivates me to continue. The data doesn''t lie.', 'EXCELLENT', '2024-05-01 09:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440032', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Energy Levels', 'My energy has been consistently high since starting these habits. No more afternoon crashes.', 'EXCELLENT', '2024-05-07 14:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440033', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Social Impact', 'Friends have noticed positive changes in me. Some are even starting their own habits.', 'EXCELLENT', '2024-05-14 18:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440034', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Mental Clarity', 'My mind feels sharper and more focused. Decision making has become easier.', 'GOOD', '2024-05-21 10:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440035', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Physical Changes', 'Noticed improvements in my fitness and overall health. The gym habit is paying off.', 'EXCELLENT', '2024-05-28 07:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440036', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Time Management', 'Better habits have led to better time management. I get more done in less time.', 'EXCELLENT', '2024-06-04 13:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440037', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Stress Reduction', 'Overall stress levels have decreased significantly. Life feels more manageable.', 'GOOD', '2024-06-11 15:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440038', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Relationship Benefits', 'Better sleep and mood have improved my relationships with family and friends.', 'EXCELLENT', '2024-06-18 19:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440039', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Self-Discipline', 'Building habits has strengthened my self-discipline in other areas of life too.', 'EXCELLENT', '2024-06-25 08:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440040', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Morning Person', 'I''ve naturally become a morning person. Starting the day early sets a positive tone.', 'GOOD', '2024-04-14 06:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440041', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Evening Wind Down', 'My evening routine helps me disconnect and prepare for quality sleep.', 'EXCELLENT', '2024-04-21 21:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440042', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Weekend Warrior', 'Weekends used to derail my progress. Now I maintain consistency even on weekends.', 'EXCELLENT', '2024-04-28 12:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440043', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Travel Adaptation', 'Managed to maintain most habits while traveling. It required planning but was worth it.', 'GOOD', '2024-05-05 16:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440044', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Sick Day Strategy', 'Even when feeling under the weather, I modified my habits instead of quitting completely.', 'GOOD', '2024-05-12 14:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440045', 'f15b2a75-292e-4bf1-936c-880e9352c7be', 'Three Month Milestone', 'Reaching the 90-day mark feels incredible. These habits are now part of who I am.', 'EXCELLENT', '2024-06-30 20:30:00+00');

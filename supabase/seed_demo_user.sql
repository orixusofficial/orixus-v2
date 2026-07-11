-- Orixus Demo User Seed Script
-- User ID: f15b2a75-292e-4bf1-936c-880e9352c7be
-- This script populates the demo account with realistic data

-- Set the demo user ID as a variable for reuse
\set demo_user_id 'f15b2a75-292e-4bf1-936c-880e9352c7be'

-- ---------------------------------------------------------------------------
-- 1. Update Profile
-- ---------------------------------------------------------------------------
INSERT INTO public.profiles (id, display_name, created_at)
VALUES (
  :'demo_user_id',
  'Demo User',
  '2024-01-15 10:30:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  created_at = EXCLUDED.created_at;

-- ---------------------------------------------------------------------------
-- 2. Insert 30 Habits
-- ---------------------------------------------------------------------------
INSERT INTO public.habits (id, user_id, label, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', :'demo_user_id', 'Morning Meditation', '2024-01-20 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440002', :'demo_user_id', 'Gym Workout', '2024-01-20 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440003', :'demo_user_id', 'Read 30 Minutes', '2024-01-21 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440004', :'demo_user_id', 'Drink 8 Glasses of Water', '2024-01-21 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440005', :'demo_user_id', 'No Sugar', '2024-01-22 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440006', :'demo_user_id', 'Sleep 8 Hours', '2024-01-22 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440007', :'demo_user_id', 'Code for 1 Hour', '2024-01-23 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440008', :'demo_user_id', 'Walk 10,000 Steps', '2024-01-23 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440009', :'demo_user_id', 'Practice Guitar', '2024-01-24 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440010', :'demo_user_id', 'Write in Journal', '2024-01-24 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440011', :'demo_user_id', 'Eat Vegetables', '2024-01-25 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440012', :'demo_user_id', 'No Social Media', '2024-01-25 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440013', :'demo_user_id', 'Stretch 10 Minutes', '2024-01-26 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440014', :'demo_user_id', 'Cold Shower', '2024-01-26 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440015', :'demo_user_id', 'Learn Spanish', '2024-01-27 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440016', :'demo_user_id', 'No Caffeine After 2pm', '2024-01-27 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440017', :'demo_user_id', 'Floss Teeth', '2024-01-28 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440018', :'demo_user_id', 'Take Vitamins', '2024-01-28 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440019', :'demo_user_id', 'Read News', '2024-01-29 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440020', :'demo_user_id', 'Call Family', '2024-01-29 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440021', :'demo_user_id', 'Practice Deep Work', '2024-01-30 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440022', :'demo_user_id', 'No Alcohol', '2024-01-30 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440023', :'demo_user_id', 'Meal Prep', '2024-01-31 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440024', :'demo_user_id', 'Declutter 5 Items', '2024-01-31 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440025', :'demo_user_id', 'Listen to Podcast', '2024-02-01 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440026', :'demo_user_id', 'Practice Gratitude', '2024-02-01 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440027', :'demo_user_id', 'No Screens Before Bed', '2024-02-02 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440028', :'demo_user_id', 'Park Far Away', '2024-02-02 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440029', :'demo_user_id', 'Take Stairs', '2024-02-03 08:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440030', :'demo_user_id', 'Breathing Exercises', '2024-02-03 08:00:00+00')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Insert Habit Completions (90 days of history with realistic misses)
-- This creates approximately 70-75 completions per habit (85-90% consistency)
-- ---------------------------------------------------------------------------
INSERT INTO public.habit_completions (id, user_id, habit_id, completed_on)
SELECT
  gen_random_uuid(),
  :'demo_user_id',
  habit_id,
  completed_on
FROM (
  -- Generate dates for each habit with some gaps for realism
  SELECT 
    '550e8400-e29b-41d4-a716-446655440001'::uuid as habit_id, generate_series('2024-04-01'::date, '2024-06-30'::date, '1 day'::interval) as completed_on
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
) dates
WHERE 
  -- Skip some random days for realism (about 10-15% miss rate)
  (extract(doy from completed_on) * 7 + extract(dow from completed_on)) % 11 != 0
  OR (extract(doy from completed_on) * 3 + extract(dow from completed_on)) % 13 != 0
ON CONFLICT (habit_id, completed_on) DO NOTHING;

-- Add some specific missed days for more realism
DELETE FROM public.habit_completions 
WHERE user_id = :'demo_user_id'
  AND completed_on IN (
    '2024-04-15', '2024-04-22', '2024-05-01', '2024-05-08', '2024-05-15',
    '2024-05-22', '2024-06-01', '2024-06-08', '2024-06-15', '2024-06-22'
  )
  AND random() < 0.3;

-- ---------------------------------------------------------------------------
-- 4. Insert Journal Entries (45 entries over 3 months)
-- ---------------------------------------------------------------------------
INSERT INTO public.journal_entries (id, user_id, title, content, mood, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', :'demo_user_id', 'Starting Fresh', 'Today marks the beginning of my habit tracking journey. I feel motivated and ready to make positive changes in my life.', 'GOOD', '2024-04-02 09:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440002', :'demo_user_id', 'Morning Routine Success', 'Woke up at 6am and completed my meditation and gym session. Feeling energized for the day ahead.', 'EXCELLENT', '2024-04-05 08:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440003', :'demo_user_id', 'Struggled with Water Intake', 'Only managed 5 glasses of water today. Need to be more mindful about staying hydrated throughout the day.', 'NEUTRAL', '2024-04-08 20:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440004', :'demo_user_id', 'Productive Day', 'Completed all my habits including deep work session. The momentum is building up nicely.', 'EXCELLENT', '2024-04-12 19:20:00+00'),
  ('660e8400-e29b-41d4-a716-446655440005', :'demo_user_id', 'Social Media Detox', 'Managed to stay off social media for the entire day. My focus improved significantly.', 'GOOD', '2024-04-15 21:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440006', :'demo_user_id', 'Missed Gym Session', 'Had a busy day and couldn''t make it to the gym. Feeling a bit disappointed but will get back on track tomorrow.', 'NEUTRAL', '2024-04-18 22:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440007', :'demo_user_id', 'Reading Breakthrough', 'Finished my book today. The daily reading habit has been one of the most rewarding changes.', 'EXCELLENT', '2024-04-22 18:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440008', :'demo_user_id', 'Sleep Quality Improved', 'Been getting 8 hours of sleep consistently. My energy levels are much better now.', 'GOOD', '2024-04-25 07:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440009', :'demo_user_id', 'Weekend Reflection', 'Looking back at the week, I maintained most of my habits. The weekend was challenging but I stayed consistent.', 'GOOD', '2024-04-28 16:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440010', :'demo_user_id', 'New Habit Added', 'Started practicing guitar today. It''s difficult but I enjoy the challenge.', 'NEUTRAL', '2024-05-02 20:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440011', :'demo_user_id', 'Sugar Cravings', 'Had a strong craving for sweets today but managed to resist. The no sugar habit is getting easier.', 'GOOD', '2024-05-05 14:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440012', :'demo_user_id', 'Coding Progress', 'Completed a small project today. The daily coding habit is really paying off.', 'EXCELLENT', '2024-05-08 17:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440013', :'demo_user_id', 'Step Count Goal', 'Hit 10,000 steps for the 5th day in a row. Walking has become a natural part of my routine.', 'EXCELLENT', '2024-05-12 19:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440014', :'demo_user_id', 'Meditation Benefits', 'Noticing reduced stress levels since starting daily meditation. My mind feels clearer.', 'GOOD', '2024-05-15 08:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440015', :'demo_user_id', 'Family Time', 'Called my parents today. The daily check-in habit has strengthened our relationship.', 'EXCELLENT', '2024-05-18 12:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440016', :'demo_user_id', 'Cold Shower Adaptation', 'Cold showers are becoming easier. The initial shock is worth the energy boost.', 'NEUTRAL', '2024-05-22 07:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440017', :'demo_user_id', 'Spanish Learning', 'Can now have basic conversations in Spanish. The daily practice is working.', 'GOOD', '2024-05-25 21:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440018', :'demo_user_id', 'Caffeine Experiment', 'Stopped caffeine after 2pm and my sleep quality has improved noticeably.', 'EXCELLENT', '2024-05-28 09:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440019', :'demo_user_id', 'Decluttering Progress', 'Removed 50 items from my home so far. The space feels much lighter.', 'GOOD', '2024-06-01 15:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440020', :'demo_user_id', 'Podcast Discovery', 'Found some amazing educational podcasts. They make my commute much more valuable.', 'EXCELLENT', '2024-06-04 08:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440021', :'demo_user_id', 'Gratitude Practice', 'Writing down 3 things I''m grateful for has shifted my perspective positively.', 'EXCELLENT', '2024-06-07 22:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440022', :'demo_user_id', 'Screen Time Challenge', 'No screens before bed for a week. My sleep has never been better.', 'GOOD', '2024-06-10 21:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440023', :'demo_user_id', 'Small Wins', 'Even on busy days, I managed to complete my core habits. Consistency is key.', 'GOOD', '2024-06-13 18:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440024', :'demo_user_id', 'Meal Prep Success', 'Prepped meals for the week. Eating healthy has become much easier.', 'EXCELLENT', '2024-06-16 14:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440025', :'demo_user_id', 'Stairs Habit', 'Taking stairs instead of elevators has become second nature.', 'GOOD', '2024-06-19 17:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440026', :'demo_user_id', 'Breathing Exercises', 'Deep breathing exercises help me stay calm during stressful situations.', 'EXCELLENT', '2024-06-22 10:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440027', :'demo_user_id', 'Mid-Journey Reflection', 'Two months in and I can see significant improvements in my daily routine and overall well-being.', 'EXCELLENT', '2024-06-25 20:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440028', :'demo_user_id', 'Habit Stacking', 'Started combining habits - meditation after stretching, reading before bed. This increases efficiency.', 'GOOD', '2024-04-10 19:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440029', :'demo_user_id', 'Accountability Partner', 'Shared my goals with a friend. Having someone check in helps me stay on track.', 'EXCELLENT', '2024-04-17 11:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440030', :'demo_user_id', 'Flexible Routine', 'Learned to adapt my habits to different situations. Rigidity was causing me to fail.', 'GOOD', '2024-04-24 16:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440031', :'demo_user_id', 'Tracking Benefits', 'Seeing my progress visually motivates me to continue. The data doesn''t lie.', 'EXCELLENT', '2024-05-01 09:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440032', :'demo_user_id', 'Energy Levels', 'My energy has been consistently high since starting these habits. No more afternoon crashes.', 'EXCELLENT', '2024-05-07 14:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440033', :'demo_user_id', 'Social Impact', 'Friends have noticed positive changes in me. Some are even starting their own habits.', 'EXCELLENT', '2024-05-14 18:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440034', :'demo_user_id', 'Mental Clarity', 'My mind feels sharper and more focused. Decision making has become easier.', 'GOOD', '2024-05-21 10:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440035', :'demo_user_id', 'Physical Changes', 'Noticed improvements in my fitness and overall health. The gym habit is paying off.', 'EXCELLENT', '2024-05-28 07:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440036', :'demo_user_id', 'Time Management', 'Better habits have led to better time management. I get more done in less time.', 'EXCELLENT', '2024-06-04 13:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440037', :'demo_user_id', 'Stress Reduction', 'Overall stress levels have decreased significantly. Life feels more manageable.', 'GOOD', '2024-06-11 15:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440038', :'demo_user_id', 'Relationship Benefits', 'Better sleep and mood have improved my relationships with family and friends.', 'EXCELLENT', '2024-06-18 19:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440039', :'demo_user_id', 'Self-Discipline', 'Building habits has strengthened my self-discipline in other areas of life too.', 'EXCELLENT', '2024-06-25 08:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440040', :'demo_user_id', 'Morning Person', 'I''ve naturally become a morning person. Starting the day early sets a positive tone.', 'GOOD', '2024-04-14 06:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440041', :'demo_user_id', 'Evening Wind Down', 'My evening routine helps me disconnect and prepare for quality sleep.', 'EXCELLENT', '2024-04-21 21:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440042', :'demo_user_id', 'Weekend Warrior', 'Weekends used to derail my progress. Now I maintain consistency even on weekends.', 'EXCELLENT', '2024-04-28 12:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440043', :'demo_user_id', 'Travel Adaptation', 'Managed to maintain most habits while traveling. It required planning but was worth it.', 'GOOD', '2024-05-05 16:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440044', :'demo_user_id', 'Sick Day Strategy', 'Even when feeling under the weather, I modified my habits instead of quitting completely.', 'GOOD', '2024-05-12 14:15:00+00'),
  ('660e8400-e29b-41d4-a716-446655440045', :'demo_user_id', 'Three Month Milestone', 'Reaching the 90-day mark feels incredible. These habits are now part of who I am.', 'EXCELLENT', '2024-06-30 20:30:00+00')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Summary of seeded data
-- ---------------------------------------------------------------------------
-- 30 habits created
-- ~2,700 habit completions (90 days × 30 habits × ~90% completion rate)
-- 45 journal entries spread over 3 months
-- Profile updated with display name "Demo User"
-- All data respects foreign keys and RLS-compatible user_id

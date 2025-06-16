-- Insert dummy data for testing

-- Insert dummy profiles (teachers and students)
INSERT INTO public.profiles (id, email, first_name, last_name, role, subjects, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'teacher1@example.com', 'Rabbi', 'Cohen', 'teacher', ARRAY['Torah (Tanakh)', 'Talmud'], NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'teacher2@example.com', 'Rabbi', 'Levy', 'teacher', ARRAY['Mishnah', 'Halakha'], NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'teacher3@example.com', 'Rabbi', 'Goldberg', 'teacher', ARRAY['Jewish Philosophy', 'Kabbalah'], NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'teacher4@example.com', 'Rabbi', 'Katz', 'teacher', ARRAY['Hebrew Language', 'Jewish Ethics'], NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'teacher5@example.com', 'Rabbi', 'Weiss', 'teacher', ARRAY['Chassidut', 'Mussar'], NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'student1@example.com', 'David', 'Miller', 'student', NULL, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'student2@example.com', 'Sarah', 'Cohen', 'student', NULL, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'student3@example.com', 'Rachel', 'Goldberg', 'student', NULL, NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'student4@example.com', 'Moshe', 'Levy', 'student', NULL, NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'student5@example.com', 'Rivka', 'Katz', 'student', NULL, NOW(), NOW());

-- Insert dummy courses
INSERT INTO public.courses (id, title, description, subject, price, teacher_id, is_active, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Introduction to Torah', 'Learn the basics of Torah study', 'Torah (Tanakh)', 50, '11111111-1111-1111-1111-111111111111', true, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Talmud for Beginners', 'Start your Talmud journey', 'Talmud', 60, '22222222-2222-2222-2222-222222222222', true, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Jewish Philosophy 101', 'Explore Jewish thought', 'Jewish Philosophy', 45, '33333333-3333-3333-3333-333333333333', true, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Modern Hebrew', 'Learn to speak Hebrew', 'Hebrew Language', 40, '44444444-4444-4444-4444-444444444444', true, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Ethics in Judaism', 'Study Jewish ethics', 'Jewish Ethics', 55, '55555555-5555-5555-5555-555555555555', true, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Advanced Torah Study', 'Deep dive into Torah', 'Torah (Tanakh)', 70, '11111111-1111-1111-1111-111111111111', true, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Talmud Advanced', 'Advanced Talmud study', 'Talmud', 75, '22222222-2222-2222-2222-222222222222', true, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Kabbalah Basics', 'Introduction to Kabbalah', 'Kabbalah', 65, '33333333-3333-3333-3333-333333333333', true, NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Hebrew Writing', 'Learn to write in Hebrew', 'Hebrew Language', 45, '44444444-4444-4444-4444-444444444444', true, NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mussar Practice', 'Daily Mussar practice', 'Mussar', 50, '55555555-5555-5555-5555-555555555555', true, NOW(), NOW());

-- Insert dummy subjects
INSERT INTO public.subjects (id, name, category, description, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Torah (Tanakh)', 'Bible', 'Study of the Five Books of Moses', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Talmud', 'Talmud', 'Study of the Oral Law', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Mishnah', 'Talmud', 'Study of the Mishnah', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Halakha', 'Law', 'Jewish Law and Practice', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Jewish Philosophy', 'Philosophy', 'Jewish Thought and Philosophy', NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Kabbalah', 'Mysticism', 'Jewish Mysticism', NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Hebrew Language', 'Language', 'Modern and Biblical Hebrew', NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Jewish Ethics', 'Ethics', 'Jewish Moral Philosophy', NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Chassidut', 'Mysticism', 'Chassidic Thought', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mussar', 'Ethics', 'Jewish Ethical Development', NOW());

-- Insert dummy course sessions
INSERT INTO public.course_sessions (id, course_id, teacher_id, student_id, session_date, duration_minutes, status, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', NOW() + interval '1 day', 60, 'scheduled', NOW()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', NOW() + interval '2 days', 60, 'scheduled', NOW()),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', NOW() + interval '3 days', 60, 'scheduled', NOW()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', NOW() + interval '4 days', 60, 'scheduled', NOW()),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() + interval '5 days', 60, 'scheduled', NOW()),
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', NOW() + interval '6 days', 60, 'scheduled', NOW()),
  ('77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', NOW() + interval '7 days', 60, 'scheduled', NOW()),
  ('88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', NOW() + interval '8 days', 60, 'scheduled', NOW()),
  ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', NOW() + interval '9 days', 60, 'scheduled', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() + interval '10 days', 60, 'scheduled', NOW());

-- Insert dummy teachers
INSERT INTO public.teachers (id, profile_id, experience_years, hourly_rate, is_verified, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 10, 50, true, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 8, 45, true, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 12, 55, true, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 6, 40, true, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 15, 60, true, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 9, 48, true, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 7, 42, true, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 11, 52, true, NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 5, 38, true, NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 14, 58, true, NOW(), NOW());

-- Insert dummy rabbis
INSERT INTO public.rabbis (id, name, title, bio, contact_email, contact_phone, location, experience_years, is_active, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Rabbi Cohen', 'Senior Rabbi', 'Expert in Torah and Talmud', 'rabbi1@example.com', '+1234567890', 'New York', 20, true, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Rabbi Levy', 'Community Rabbi', 'Specialist in Jewish Law', 'rabbi2@example.com', '+1234567891', 'Los Angeles', 15, true, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Rabbi Goldberg', 'Yeshiva Dean', 'Expert in Jewish Philosophy', 'rabbi3@example.com', '+1234567892', 'Chicago', 25, true, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Rabbi Katz', 'Synagogue Rabbi', 'Specialist in Jewish Ethics', 'rabbi4@example.com', '+1234567893', 'Miami', 12, true, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Rabbi Weiss', 'Community Leader', 'Expert in Chassidut', 'rabbi5@example.com', '+1234567894', 'Boston', 18, true, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Rabbi Miller', 'Senior Rabbi', 'Expert in Kabbalah', 'rabbi6@example.com', '+1234567895', 'Philadelphia', 22, true, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Rabbi Schwartz', 'Community Rabbi', 'Specialist in Mussar', 'rabbi7@example.com', '+1234567896', 'San Francisco', 16, true, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Rabbi Friedman', 'Yeshiva Dean', 'Expert in Talmud', 'rabbi8@example.com', '+1234567897', 'Seattle', 19, true, NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Rabbi Rosen', 'Synagogue Rabbi', 'Specialist in Hebrew', 'rabbi9@example.com', '+1234567898', 'Denver', 14, true, NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rabbi Klein', 'Community Leader', 'Expert in Jewish History', 'rabbi10@example.com', '+1234567899', 'Atlanta', 17, true, NOW(), NOW());

-- Insert dummy study groups
INSERT INTO public.study_groups (id, name, description, facilitator_id, subject_id, max_participants, is_active, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Torah Study Group', 'Weekly Torah study', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 10, true, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Talmud Study Group', 'Daily Talmud study', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 8, true, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Philosophy Group', 'Jewish philosophy discussion', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 12, true, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Hebrew Practice', 'Hebrew conversation practice', '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 15, true, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Ethics Discussion', 'Jewish ethics study', '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 10, true, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Kabbalah Study', 'Kabbalah study group', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 8, true, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Mussar Practice', 'Daily Mussar practice', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 10, true, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Chassidut Study', 'Chassidic thought study', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 12, true, NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Hebrew Writing', 'Hebrew writing practice', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 15, true, NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jewish History', 'Jewish history study', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10, true, NOW(), NOW());

-- Insert dummy study group members
INSERT INTO public.study_group_members (id, group_id, member_id, joined_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', NOW()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', NOW()),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', NOW()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', NOW()),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW()),
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', NOW()),
  ('77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', NOW()),
  ('88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', NOW()),
  ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW()); 
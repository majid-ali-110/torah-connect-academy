-- INSERT TEST DATA (5 records per table)

-- Step 1: Insert test profiles (teachers, students, and admin)
INSERT INTO profiles (id, email, first_name, last_name, role, bio, location, subjects, languages, hourly_rate, approval_status) VALUES
('a1111111-1111-1111-1111-111111111111', 'admin@torahconnect.com', 'Admin', 'User', 'admin', 'Platform administrator', 'Jerusalem', NULL, ARRAY['English', 'Hebrew'], NULL, 'approved'),
('t1111111-1111-1111-1111-111111111111', 'rabbi.cohen@example.com', 'Rabbi Moshe', 'Cohen', 'teacher', 'Expert in Talmud and Jewish Law', 'New York', ARRAY['Talmud', 'Halakha'], ARRAY['English', 'Hebrew', 'Yiddish'], 50.00, 'approved'),
('t2222222-2222-2222-2222-222222222222', 'rabbi.levy@example.com', 'Rabbi David', 'Levy', 'teacher', 'Torah and Tanakh specialist', 'Los Angeles', ARRAY['Torah', 'Tanakh'], ARRAY['English', 'Hebrew'], 45.00, 'approved'),
('t3333333-3333-3333-3333-333333333333', 'rabbi.goldberg@example.com', 'Rabbi Sarah', 'Goldberg', 'teacher', 'Jewish Philosophy and Ethics teacher', 'Chicago', ARRAY['Jewish Philosophy', 'Ethics'], ARRAY['English', 'Hebrew'], 55.00, 'approved'),
('t4444444-4444-4444-4444-444444444444', 'rabbi.katz@example.com', 'Rabbi Miriam', 'Katz', 'teacher', 'Hebrew Language instructor', 'Miami', ARRAY['Hebrew Language'], ARRAY['English', 'Hebrew', 'French'], 40.00, 'approved'),
('t5555555-5555-5555-5555-555555555555', 'rabbi.weiss@example.com', 'Rabbi Aaron', 'Weiss', 'teacher', 'Kabbalah and Mysticism expert', 'Boston', ARRAY['Kabbalah', 'Chassidut'], ARRAY['English', 'Hebrew'], 60.00, 'approved'),
('s1111111-1111-1111-1111-111111111111', 'david.miller@example.com', 'David', 'Miller', 'student', 'Beginner student interested in Torah study', 'New York', NULL, ARRAY['English'], NULL, 'approved'),
('s2222222-2222-2222-2222-222222222222', 'sarah.johnson@example.com', 'Sarah', 'Johnson', 'student', 'Advanced Talmud student', 'Los Angeles', NULL, ARRAY['English'], NULL, 'approved'),
('s3333333-3333-3333-3333-333333333333', 'rachel.green@example.com', 'Rachel', 'Green', 'student', 'Hebrew language learner', 'Chicago', NULL, ARRAY['English'], NULL, 'approved'),
('s4444444-4444-4444-4444-444444444444', 'michael.brown@example.com', 'Michael', 'Brown', 'student', 'Philosophy enthusiast', 'Miami', NULL, ARRAY['English'], NULL, 'approved'),
('s5555555-5555-5555-5555-555555555555', 'rebecca.davis@example.com', 'Rebecca', 'Davis', 'student', 'Kabbalah student', 'Boston', NULL, ARRAY['English'], NULL, 'approved');

-- Step 2: Insert subjects
INSERT INTO subjects (id, name, hebrew_name, category, description) VALUES
('sub11111-1111-1111-1111-111111111111', 'Torah', 'תורה', 'Bible', 'Study of the Five Books of Moses'),
('sub22222-2222-2222-2222-222222222222', 'Talmud', 'תלמוד', 'Oral Law', 'Study of the Oral Torah and rabbinical discussions'),
('sub33333-3333-3333-3333-333333333333', 'Hebrew Language', 'עברית', 'Language', 'Modern and Biblical Hebrew language study'),
('sub44444-4444-4444-4444-444444444444', 'Jewish Philosophy', 'פילוסופיה יהודית', 'Philosophy', 'Jewish thought and philosophical concepts'),
('sub55555-5555-5555-5555-555555555555', 'Kabbalah', 'קבלה', 'Mysticism', 'Jewish mystical teachings and spirituality');

-- Step 3: Insert teachers
INSERT INTO teachers (id, profile_id, experience_years, hourly_rate, rating, is_verified) VALUES
('teach111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111', 15, 50.00, 4.8, true),
('teach222-2222-2222-2222-222222222222', 't2222222-2222-2222-2222-222222222222', 10, 45.00, 4.7, true),
('teach333-3333-3333-3333-333333333333', 't3333333-3333-3333-3333-333333333333', 12, 55.00, 4.9, true),
('teach444-4444-4444-4444-444444444444', 't4444444-4444-4444-4444-444444444444', 8, 40.00, 4.6, true),
('teach555-5555-5555-5555-555555555555', 't5555555-5555-5555-5555-555555555555', 20, 60.00, 5.0, true);

-- Step 4: Insert courses
INSERT INTO courses (id, title, description, subject, teacher_id, price, audience, session_duration_minutes) VALUES
('course11-1111-1111-1111-111111111111', 'Introduction to Talmud', 'Learn the basics of Talmudic study and methodology', 'Talmud', 't1111111-1111-1111-1111-111111111111', 50.00, 'all', 60),
('course22-2222-2222-2222-222222222222', 'Torah Portion of the Week', 'Weekly Torah portion study and discussion', 'Torah', 't2222222-2222-2222-2222-222222222222', 45.00, 'all', 45),
('course33-3333-3333-3333-333333333333', 'Jewish Ethics in Daily Life', 'Practical application of Jewish ethical principles', 'Jewish Philosophy', 't3333333-3333-3333-3333-333333333333', 55.00, 'adults', 60),
('course44-4444-4444-4444-444444444444', 'Conversational Hebrew', 'Learn to speak Hebrew fluently', 'Hebrew Language', 't4444444-4444-4444-4444-444444444444', 40.00, 'all', 30),
('course55-5555-5555-5555-555555555555', 'Introduction to Kabbalah', 'Explore the mystical dimensions of Judaism', 'Kabbalah', 't5555555-5555-5555-5555-555555555555', 60.00, 'adults', 90);

-- Step 5: Insert rabbis
INSERT INTO rabbis (id, name, title, bio, location, experience_years, contact_email) VALUES
('rabbi111-1111-1111-1111-111111111111', 'Rabbi Yosef Goldstein', 'Chief Rabbi', 'Leading authority on Jewish law and tradition', 'Jerusalem', 30, 'rabbi.goldstein@example.com'),
('rabbi222-2222-2222-2222-222222222222', 'Rabbi Esther Friedman', 'Community Rabbi', 'Specializes in Jewish education and outreach', 'New York', 20, 'rabbi.friedman@example.com'),
('rabbi333-3333-3333-3333-333333333333', 'Rabbi Daniel Schwartz', 'Yeshiva Dean', 'Expert in Talmudic studies', 'Brooklyn', 25, 'rabbi.schwartz@example.com'),
('rabbi444-4444-4444-4444-444444444444', 'Rabbi Miriam Klein', 'Synagogue Rabbi', 'Focus on modern Jewish life and practice', 'Los Angeles', 15, 'rabbi.klein@example.com'),
('rabbi555-5555-5555-5555-555555555555', 'Rabbi Abraham Rosen', 'Senior Rabbi', 'Kabbalah and mysticism scholar', 'Safed', 35, 'rabbi.rosen@example.com');

-- Step 6: Insert study groups
INSERT INTO study_groups (id, name, description, subject_id, facilitator_id, max_participants) VALUES
('group111-1111-1111-1111-111111111111', 'Daily Talmud Study', 'Join us for daily Talmud page study', 'sub22222-2222-2222-2222-222222222222', 't1111111-1111-1111-1111-111111111111', 15),
('group222-2222-2222-2222-222222222222', 'Torah Discussion Circle', 'Weekly Torah portion discussion group', 'sub11111-1111-1111-1111-111111111111', 't2222222-2222-2222-2222-222222222222', 20),
('group333-3333-3333-3333-333333333333', 'Hebrew Conversation Club', 'Practice speaking Hebrew in a friendly environment', 'sub33333-3333-3333-3333-333333333333', 't4444444-4444-4444-4444-444444444444', 10),
('group444-4444-4444-4444-444444444444', 'Philosophy Study Group', 'Explore Jewish philosophical texts together', 'sub44444-4444-4444-4444-444444444444', 't3333333-3333-3333-3333-333333333333', 12),
('group555-5555-5555-5555-555555555555', 'Kabbalah Meditation Circle', 'Learn and practice Kabbalistic meditation', 'sub55555-5555-5555-5555-555555555555', 't5555555-5555-5555-5555-555555555555', 8);

-- Step 7: Insert study group members
INSERT INTO study_group_members (group_id, member_id) VALUES
('group111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111'),
('group111-1111-1111-1111-111111111111', 's2222222-2222-2222-2222-222222222222'),
('group222-2222-2222-2222-222222222222', 's3333333-3333-3333-3333-333333333333'),
('group333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333'),
('group444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444');

-- Step 8: Insert course sessions
INSERT INTO course_sessions (id, course_id, teacher_id, student_id, session_date, duration_minutes, session_type, status) VALUES
('sess1111-1111-1111-1111-111111111111', 'course11-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', NOW() + INTERVAL '1 day', 60, 'trial', 'scheduled'),
('sess2222-2222-2222-2222-222222222222', 'course22-2222-2222-2222-222222222222', 't2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', NOW() + INTERVAL '2 days', 45, 'regular', 'scheduled'),
('sess3333-3333-3333-3333-333333333333', 'course33-3333-3333-3333-333333333333', 't3333333-3333-3333-3333-333333333333', 's4444444-4444-4444-4444-444444444444', NOW() + INTERVAL '3 days', 60, 'regular', 'scheduled'),
('sess4444-4444-4444-4444-444444444444', 'course44-4444-4444-4444-444444444444', 't4444444-4444-4444-4444-444444444444', 's3333333-3333-3333-3333-333333333333', NOW() + INTERVAL '4 days', 30, 'trial', 'scheduled'),
('sess5555-5555-5555-5555-555555555555', 'course55-5555-5555-5555-555555555555', 't5555555-5555-5555-5555-555555555555', 's5555555-5555-5555-5555-555555555555', NOW() + INTERVAL '5 days', 90, 'regular', 'scheduled');

-- Step 9: Insert live classes
INSERT INTO live_classes (id, title, description, teacher_id, course_key, scheduled_at, meeting_link, price, is_free) VALUES
('live1111-1111-1111-1111-111111111111', 'Talmud Masterclass', 'Advanced Talmudic analysis techniques', 't1111111-1111-1111-1111-111111111111', 'TALM101', NOW() + INTERVAL '7 days', 'https://zoom.us/j/123456789', 25.00, false),
('live2222-2222-2222-2222-222222222222', 'Free Torah Study Session', 'Open Torah study for all levels', 't2222222-2222-2222-2222-222222222222', 'TORAH101', NOW() + INTERVAL '8 days', 'https://zoom.us/j/234567890', 0.00, true),
('live3333-3333-3333-3333-333333333333', 'Ethics Workshop', 'Interactive Jewish ethics workshop', 't3333333-3333-3333-3333-333333333333', 'ETHICS101', NOW() + INTERVAL '9 days', 'https://zoom.us/j/345678901', 30.00, false),
('live4444-4444-4444-4444-444444444444', 'Hebrew Immersion Day', 'Full day Hebrew language immersion', 't4444444-4444-4444-4444-444444444444', 'HEB101', NOW() + INTERVAL '10 days', 'https://zoom.us/j/456789012', 50.00, false),
('live5555-5555-5555-5555-555555555555', 'Kabbalah Seminar', 'Deep dive into Kabbalistic concepts', 't5555555-5555-5555-5555-555555555555', 'KAB101', NOW() + INTERVAL '11 days', 'https://zoom.us/j/567890123', 40.00, false);

-- Step 10: Insert conversations
INSERT INTO conversations (id, student_id, teacher_id) VALUES
('conv1111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111'),
('conv2222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 't2222222-2222-2222-2222-222222222222'),
('conv3333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 't4444444-4444-4444-4444-444444444444'),
('conv4444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444', 't3333333-3333-3333-3333-333333333333'),
('conv5555-5555-5555-5555-555555555555', 's5555555-5555-5555-5555-555555555555', 't5555555-5555-5555-5555-555555555555');

-- Step 11: Insert chat messages
INSERT INTO chat_messages (conversation_id, sender_id, content, message_type) VALUES
('conv1111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Hello Rabbi, I would like to schedule a trial lesson for Talmud study.', 'text'),
('conv1111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111', 'Shalom! I would be happy to help you. When would you like to schedule your trial lesson?', 'text'),
('conv2222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'Can we discuss this weeks Torah portion?', 'text'),
('conv3333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 'I need help with Hebrew pronunciation.', 'text'),
('conv4444-4444-4444-4444-444444444444', 't3333333-3333-3333-3333-333333333333', 'Welcome! Lets explore Jewish philosophy together.', 'text');

-- Step 12: Insert support tickets
INSERT INTO support_tickets (user_id, email, subject, description, status) VALUES
('s1111111-1111-1111-1111-111111111111', 'david.miller@example.com', 'Cannot access course materials', 'I enrolled in the Talmud course but cannot see the materials.', 'open'),
('s2222222-2222-2222-2222-222222222222', 'sarah.johnson@example.com', 'Payment issue', 'My payment was processed twice for the same course.', 'open'),
('s3333333-3333-3333-3333-333333333333', 'rachel.green@example.com', 'Technical problem with video', 'The video keeps freezing during live sessions.', 'open'),
('s4444444-4444-4444-4444-444444444444', 'michael.brown@example.com', 'Request for course recommendation', 'I am looking for beginner philosophy courses.', 'open'),
('s5555555-5555-5555-5555-555555555555', 'rebecca.davis@example.com', 'Account verification', 'My teacher account is still pending approval.', 'open');

-- Step 13: Insert discussion forums
INSERT INTO discussion_forums (title, content, author_id, subject_id, tags) VALUES
('Understanding Rashi Commentary', 'How do you approach studying Rashi on the Torah?', 's1111111-1111-1111-1111-111111111111', 'sub11111-1111-1111-1111-111111111111', ARRAY['Torah', 'Commentary', 'Rashi']),
('Daily Talmud Study Tips', 'Share your best practices for consistent Talmud study.', 's2222222-2222-2222-2222-222222222222', 'sub22222-2222-2222-2222-222222222222', ARRAY['Talmud', 'Study Tips']),
('Hebrew Grammar Questions', 'A place to ask questions about Hebrew grammar.', 's3333333-3333-3333-3333-333333333333', 'sub33333-3333-3333-3333-333333333333', ARRAY['Hebrew', 'Grammar']),
('Maimonides vs Nachmanides', 'Comparing philosophical approaches of these great thinkers.', 's4444444-4444-4444-4444-444444444444', 'sub44444-4444-4444-4444-444444444444', ARRAY['Philosophy', 'Maimonides']),
('Meditation in Jewish Practice', 'Exploring meditation techniques in Jewish tradition.', 's5555555-5555-5555-5555-555555555555', 'sub55555-5555-5555-5555-555555555555', ARRAY['Kabbalah', 'Meditation']);

-- Step 14: Insert course enrollments
INSERT INTO course_enrollments (course_id, student_id) VALUES
('course11-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111'),
('course22-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222'),
('course33-3333-3333-3333-333333333333', 's4444444-4444-4444-4444-444444444444'),
('course44-4444-4444-4444-444444444444', 's3333333-3333-3333-3333-333333333333'),
('course55-5555-5555-5555-555555555555', 's5555555-5555-5555-5555-555555555555');

-- Step 15: Insert contact submissions
INSERT INTO contact_submissions (name, email, subject, message) VALUES
('John Smith', 'john.smith@example.com', 'Partnership Inquiry', 'We would like to partner with Torah Connect Academy.'),
('Mary Johnson', 'mary.johnson@example.com', 'Course Suggestion', 'Could you offer courses on Jewish history?'),
('Robert Brown', 'robert.brown@example.com', 'Technical Support', 'Having issues with the mobile app.'),
('Lisa Davis', 'lisa.davis@example.com', 'Becoming a Teacher', 'What are the requirements to teach on your platform?'),
('James Wilson', 'james.wilson@example.com', 'General Inquiry', 'Do you offer group discounts for schools?'); 
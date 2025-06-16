import { connectToDatabase } from './config';
import { profileSchema } from './models/Profile';
import { courseSchema } from './models/Course';

export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();

    // Create collections with schemas
    await db.createCollection('profiles', profileSchema);
    await db.createCollection('courses', courseSchema);
    await db.createCollection('subjects');
    await db.createCollection('teachers');
    await db.createCollection('rabbis');
    await db.createCollection('studyGroups');
    await db.createCollection('courseSessions');
    await db.createCollection('liveClasses');
    await db.createCollection('conversations');
    await db.createCollection('chatMessages');
    await db.createCollection('supportTickets');
    await db.createCollection('discussionForums');
    await db.createCollection('courseEnrollments');
    await db.createCollection('contactSubmissions');

    // Create indexes
    await db.collection('profiles').createIndex({ email: 1 }, { unique: true });
    await db.collection('courses').createIndex({ teacherId: 1 });
    await db.collection('courseSessions').createIndex({ courseId: 1 });
    await db.collection('courseSessions').createIndex({ teacherId: 1 });
    await db.collection('courseSessions').createIndex({ studentId: 1 });
    await db.collection('studyGroups').createIndex({ subjectId: 1 });
    await db.collection('studyGroups').createIndex({ facilitatorId: 1 });
    await db.collection('conversations').createIndex({ studentId: 1 });
    await db.collection('conversations').createIndex({ teacherId: 1 });
    await db.collection('chatMessages').createIndex({ conversationId: 1 });
    await db.collection('supportTickets').createIndex({ userId: 1 });
    await db.collection('discussionForums').createIndex({ subjectId: 1 });
    await db.collection('discussionForums').createIndex({ authorId: 1 });
    await db.collection('courseEnrollments').createIndex({ courseId: 1 });
    await db.collection('courseEnrollments').createIndex({ studentId: 1 });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 
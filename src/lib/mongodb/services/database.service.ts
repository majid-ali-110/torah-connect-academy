import { MongoClient, Db, Collection, ObjectId, Filter, WithId } from 'mongodb';
import { Profile } from '../models/Profile';
import { Course } from '../models/Course';
import { Message } from '../models/Message';
import { LiveCourse } from '../models/LiveCourse';
import { TrialSession } from '../models/TrialSession';

class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      const MONGODB_DB = process.env.MONGODB_DB || 'torah_connect_academy';

      this.client = await MongoClient.connect(MONGODB_URI);
      this.db = this.client.db(MONGODB_DB);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getCollection<T>(collectionName: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(collectionName);
  }

  // Profile operations
  async createProfile(profile: Omit<Profile, '_id'>): Promise<Profile> {
    const collection = this.getCollection<Profile>('profiles');
    const result = await collection.insertOne({
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...profile, _id: result.insertedId } as Profile;
  }

  async getProfileByEmail(email: string): Promise<Profile | null> {
    const collection = this.getCollection<Profile>('profiles');
    return collection.findOne({ email });
  }

  // Course operations
  async createCourse(course: Omit<Course, '_id'>): Promise<Course> {
    const collection = this.getCollection<Course>('courses');
    const result = await collection.insertOne({
      ...course,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...course, _id: result.insertedId } as Course;
  }

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    const collection = this.getCollection<Course>('courses');
    return collection.find({ teacherId: new ObjectId(teacherId) }).toArray();
  }

  // Generic operations
  async findOne<T>(collectionName: string, query: Filter<T>): Promise<WithId<T> | null> {
    const collection = this.getCollection<T>(collectionName);
    return collection.findOne(query);
  }

  async findMany<T>(collectionName: string, query: Filter<T>): Promise<WithId<T>[]> {
    const collection = this.getCollection<T>(collectionName);
    return collection.find(query).toArray();
  }

  async updateOne<T>(collectionName: string, query: Filter<T>, update: Partial<T>): Promise<boolean> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.updateOne(query, { $set: { ...update, updatedAt: new Date() } });
    return result.modifiedCount > 0;
  }

  async deleteOne<T>(collectionName: string, query: Filter<T>): Promise<boolean> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.deleteOne(query);
    return result.deletedCount > 0;
  }

  // Message operations
  async sendMessage(message: Omit<Message, '_id'>): Promise<Message> {
    const collection = this.getCollection<Message>('messages');
    const result = await collection.insertOne({
      ...message,
      timestamp: new Date(),
      read: false
    });
    return { ...message, _id: result.insertedId } as Message;
  }

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const collection = this.getCollection<Message>('messages');
    return collection.find({
      $or: [
        { senderId: new ObjectId(userId), receiverId: new ObjectId(otherUserId) },
        { senderId: new ObjectId(otherUserId), receiverId: new ObjectId(userId) }
      ]
    }).sort({ timestamp: 1 }).toArray();
  }

  async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    const collection = this.getCollection<Message>('messages');
    await collection.updateMany(
      { receiverId: new ObjectId(userId), senderId: new ObjectId(senderId), read: false },
      { $set: { read: true } }
    );
  }

  // Live Course operations
  async createLiveCourse(course: Omit<LiveCourse, '_id'>): Promise<LiveCourse> {
    const collection = this.getCollection<LiveCourse>('liveCourses');
    const result = await collection.insertOne({
      ...course,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...course, _id: result.insertedId } as LiveCourse;
  }

  async getLiveCoursesByTeacher(teacherId: string): Promise<LiveCourse[]> {
    const collection = this.getCollection<LiveCourse>('liveCourses');
    return collection.find({ teacherId: new ObjectId(teacherId) }).toArray();
  }

  async enrollStudentInLiveCourse(courseId: string, studentId: string): Promise<boolean> {
    const collection = this.getCollection<LiveCourse>('liveCourses');
    const course = await collection.findOne({ _id: new ObjectId(courseId) });
    
    if (!course || course.enrolledStudents.length >= course.maxStudents) {
      return false;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(courseId) },
      { $addToSet: { enrolledStudents: new ObjectId(studentId) } }
    );
    return result.modifiedCount > 0;
  }

  // Trial Session operations
  async createTrialSession(session: Omit<TrialSession, '_id'>): Promise<TrialSession> {
    const collection = this.getCollection<TrialSession>('trialSessions');
    const result = await collection.insertOne({
      ...session,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...session, _id: result.insertedId } as TrialSession;
  }

  async getTrialSessionsByStudent(studentId: string): Promise<TrialSession[]> {
    const collection = this.getCollection<TrialSession>('trialSessions');
    return collection.find({ studentId: new ObjectId(studentId) }).toArray();
  }

  async getTrialSessionsByTeacher(teacherId: string): Promise<TrialSession[]> {
    const collection = this.getCollection<TrialSession>('trialSessions');
    return collection.find({ teacherId: new ObjectId(teacherId) }).toArray();
  }

  async updateTrialSessionStatus(sessionId: string, status: TrialSession['status']): Promise<boolean> {
    const collection = this.getCollection<TrialSession>('trialSessions');
    const result = await collection.updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { status, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  // Teacher approval operations
  async approveTeacher(teacherId: string): Promise<boolean> {
    const collection = this.getCollection<Profile>('profiles');
    const result = await collection.updateOne(
      { _id: new ObjectId(teacherId), role: 'teacher' },
      { $set: { approvalStatus: 'approved', updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async rejectTeacher(teacherId: string): Promise<boolean> {
    const collection = this.getCollection<Profile>('profiles');
    const result = await collection.updateOne(
      { _id: new ObjectId(teacherId), role: 'teacher' },
      { $set: { approvalStatus: 'rejected', updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async getPendingTeachers(): Promise<Profile[]> {
    const collection = this.getCollection<Profile>('profiles');
    return collection.find({ role: 'teacher', approvalStatus: 'pending' }).toArray();
  }

  // Student search operations
  async searchTeachers(gender: 'male' | 'female'): Promise<Profile[]> {
    const collection = this.getCollection<Profile>('profiles');
    return collection.find({
      role: 'teacher',
      approvalStatus: 'approved',
      gender
    }).toArray();
  }
}

export const databaseService = DatabaseService.getInstance(); 
import { ObjectId } from 'mongodb';

export interface TrialSession {
  _id?: ObjectId;
  studentId: ObjectId;
  teacherId: ObjectId;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduledTime: Date;
  meetLink: string;
  duration: number; // in minutes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 
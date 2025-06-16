import { ObjectId } from 'mongodb';

export interface LiveCourse {
  _id?: ObjectId;
  teacherId: ObjectId;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  enrolledStudents: ObjectId[];
  maxStudents: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  createdAt: Date;
  updatedAt: Date;
} 
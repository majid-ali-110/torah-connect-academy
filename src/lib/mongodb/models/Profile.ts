import { ObjectId } from 'mongodb';

export interface Profile {
  _id?: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  bio?: string;
  location?: string;
  subjects?: string[];
  languages?: string[];
  hourlyRate?: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export const profileSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'firstName', 'lastName', 'role', 'approvalStatus', 'createdAt', 'updatedAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        firstName: { bsonType: 'string' },
        lastName: { bsonType: 'string' },
        role: {
          enum: ['admin', 'teacher', 'student']
        },
        bio: { bsonType: 'string' },
        location: { bsonType: 'string' },
        subjects: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        languages: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        hourlyRate: { bsonType: 'number' },
        approvalStatus: {
          enum: ['pending', 'approved', 'rejected']
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
}; 
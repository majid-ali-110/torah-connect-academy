import { ObjectId } from 'mongodb';

export interface Course {
  _id?: ObjectId;
  title: string;
  subject: string;
  description: string;
  price: number;
  teacherId: ObjectId;
  sessionDurationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export const courseSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'subject', 'description', 'price', 'teacherId', 'sessionDurationMinutes', 'createdAt', 'updatedAt'],
      properties: {
        title: { bsonType: 'string' },
        subject: { bsonType: 'string' },
        description: { bsonType: 'string' },
        price: { bsonType: 'number' },
        teacherId: { bsonType: 'objectId' },
        sessionDurationMinutes: { bsonType: 'int' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
}; 
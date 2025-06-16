import { ObjectId } from 'mongodb';

export interface Message {
  _id?: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    fileType?: string;
    fileSize?: number;
  };
} 
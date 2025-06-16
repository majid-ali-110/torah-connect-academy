import { useEffect, useState } from 'react';
import { databaseService } from '../lib/mongodb/services/database.service';
import { Profile } from '../lib/mongodb/models/Profile';
import { Course } from '../lib/mongodb/models/Course';
import { Message } from '../lib/mongodb/models/Message';
import { LiveCourse } from '../lib/mongodb/models/LiveCourse';
import { TrialSession } from '../lib/mongodb/models/TrialSession';

export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const connectToDatabase = async () => {
      try {
        await databaseService.connect();
        setIsConnected(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect to database'));
      }
    };

    connectToDatabase();

    return () => {
      databaseService.disconnect();
    };
  }, []);

  // Profile operations
  const createProfile = async (profile: Omit<Profile, '_id'>) => {
    try {
      return await databaseService.createProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create profile'));
      throw err;
    }
  };

  const getProfileByEmail = async (email: string) => {
    try {
      return await databaseService.getProfileByEmail(email);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get profile'));
      throw err;
    }
  };

  // Course operations
  const createCourse = async (course: Omit<Course, '_id'>) => {
    try {
      return await databaseService.createCourse(course);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create course'));
      throw err;
    }
  };

  const getCoursesByTeacher = async (teacherId: string) => {
    try {
      return await databaseService.getCoursesByTeacher(teacherId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get courses'));
      throw err;
    }
  };

  // Generic operations
  const findOne = async <T,>(collectionName: string, query: any) => {
    try {
      return await databaseService.findOne<T>(collectionName, query);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to find document'));
      throw err;
    }
  };

  const findMany = async <T,>(collectionName: string, query: any) => {
    try {
      return await databaseService.findMany<T>(collectionName, query);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to find documents'));
      throw err;
    }
  };

  const updateOne = async <T,>(collectionName: string, query: any, update: Partial<T>) => {
    try {
      return await databaseService.updateOne<T>(collectionName, query, update);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document'));
      throw err;
    }
  };

  const deleteOne = async <T,>(collectionName: string, query: any) => {
    try {
      return await databaseService.deleteOne<T>(collectionName, query);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document'));
      throw err;
    }
  };

  // Message operations
  const sendMessage = async (message: Omit<Message, '_id'>) => {
    try {
      return await databaseService.sendMessage(message);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      throw err;
    }
  };

  const getMessages = async (userId: string, otherUserId: string) => {
    try {
      return await databaseService.getMessages(userId, otherUserId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get messages'));
      throw err;
    }
  };

  const markMessagesAsRead = async (userId: string, senderId: string) => {
    try {
      await databaseService.markMessagesAsRead(userId, senderId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark messages as read'));
      throw err;
    }
  };

  // Live Course operations
  const createLiveCourse = async (course: Omit<LiveCourse, '_id'>) => {
    try {
      return await databaseService.createLiveCourse(course);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create live course'));
      throw err;
    }
  };

  const getLiveCoursesByTeacher = async (teacherId: string) => {
    try {
      return await databaseService.getLiveCoursesByTeacher(teacherId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get live courses'));
      throw err;
    }
  };

  const enrollStudentInLiveCourse = async (courseId: string, studentId: string) => {
    try {
      return await databaseService.enrollStudentInLiveCourse(courseId, studentId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to enroll in live course'));
      throw err;
    }
  };

  // Trial Session operations
  const createTrialSession = async (session: Omit<TrialSession, '_id'>) => {
    try {
      return await databaseService.createTrialSession(session);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create trial session'));
      throw err;
    }
  };

  const getTrialSessionsByStudent = async (studentId: string) => {
    try {
      return await databaseService.getTrialSessionsByStudent(studentId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get trial sessions'));
      throw err;
    }
  };

  const getTrialSessionsByTeacher = async (teacherId: string) => {
    try {
      return await databaseService.getTrialSessionsByTeacher(teacherId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get trial sessions'));
      throw err;
    }
  };

  const updateTrialSessionStatus = async (sessionId: string, status: TrialSession['status']) => {
    try {
      return await databaseService.updateTrialSessionStatus(sessionId, status);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update trial session'));
      throw err;
    }
  };

  // Teacher approval operations
  const approveTeacher = async (teacherId: string) => {
    try {
      return await databaseService.approveTeacher(teacherId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to approve teacher'));
      throw err;
    }
  };

  const rejectTeacher = async (teacherId: string) => {
    try {
      return await databaseService.rejectTeacher(teacherId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reject teacher'));
      throw err;
    }
  };

  const getPendingTeachers = async () => {
    try {
      return await databaseService.getPendingTeachers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get pending teachers'));
      throw err;
    }
  };

  // Student search operations
  const searchTeachers = async (gender: 'male' | 'female') => {
    try {
      return await databaseService.searchTeachers(gender);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search teachers'));
      throw err;
    }
  };

  return {
    isConnected,
    error,
    createProfile,
    getProfileByEmail,
    createCourse,
    getCoursesByTeacher,
    findOne,
    findMany,
    updateOne,
    deleteOne,
    sendMessage,
    getMessages,
    markMessagesAsRead,
    createLiveCourse,
    getLiveCoursesByTeacher,
    enrollStudentInLiveCourse,
    createTrialSession,
    getTrialSessionsByStudent,
    getTrialSessionsByTeacher,
    updateTrialSessionStatus,
    approveTeacher,
    rejectTeacher,
    getPendingTeachers,
    searchTeachers
  };
}; 
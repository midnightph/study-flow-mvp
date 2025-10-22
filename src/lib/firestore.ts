import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './auth';

// Types
export interface Subject {
  id?: string;
  name: string;
  description: string;
  color: string;
  teacher?: string;
  tasksCount: number;
  completedTasks: number;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  subject: string;
  subjectId: string;
  dueDate: Timestamp;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subjects functions
export const getSubjects = async (userId: string): Promise<Subject[]> => {
  const q = query(
    collection(db, 'subjects'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Subject)).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const addSubject = async (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'subjects'), {
    ...subject,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateSubject = async (id: string, updates: Partial<Subject>): Promise<void> => {
  const docRef = doc(db, 'subjects', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteSubject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'subjects', id));
};

// Tasks functions
export const getTasks = async (userId: string): Promise<Task[]> => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task)).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const docRef = doc(db, 'tasks', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'tasks', id));
};

// Stats functions
export const getUserStats = async (userId: string) => {
  const tasks = await getTasks(userId);
  const subjects = await getSubjects(userId);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(task =>
    !task.completed && task.dueDate.toDate() < new Date()
  ).length;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    subjectsCount: subjects.length
  };
};

// Delete all user data
export const deleteAllUserData = async (userId: string): Promise<void> => {
  try {
    // Delete all tasks
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    const taskDeletePromises = tasksSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(taskDeletePromises);

    // Delete all subjects
    const subjectsQuery = query(
      collection(db, 'subjects'),
      where('userId', '==', userId)
    );
    const subjectsSnapshot = await getDocs(subjectsQuery);
    const subjectDeletePromises = subjectsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(subjectDeletePromises);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

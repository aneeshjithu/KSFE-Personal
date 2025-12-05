import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppData } from '../types';

interface ChittyDB extends DBSchema {
  data: {
    key: string;
    value: AppData;
  };
}

const DB_NAME = 'chitty-manager-db';
const STORE_NAME = 'data';
const DATA_KEY = 'app-data';

let dbPromise: Promise<IDBPDatabase<ChittyDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<ChittyDB>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }
  return dbPromise;
};

export const saveToLocal = async (data: AppData): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, data, DATA_KEY);
};

export const loadFromLocal = async (): Promise<AppData | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, DATA_KEY);
};

export const exportToFile = (data: AppData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chitty_data_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromFile = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as AppData;
        // Basic validation
        if (!data.chitties || !Array.isArray(data.chitties)) {
          throw new Error('Invalid data format');
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

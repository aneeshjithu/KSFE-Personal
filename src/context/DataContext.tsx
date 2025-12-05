import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { AppData, Chitty, Member, Payment, Reminder } from '../types';
import { saveToLocal, loadFromLocal, exportToFile, importFromFile } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

// Initial State
const initialState: AppData = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  chitties: [],
  reminders: [],
};

// Actions
type Action =
  | { type: 'LOAD_DATA'; payload: AppData }
  | { type: 'ADD_CHITTY'; payload: Chitty }
  | { type: 'UPDATE_CHITTY'; payload: Chitty }
  | { type: 'DELETE_CHITTY'; payload: string }
  | { type: 'ADD_MEMBER'; payload: { chittyId: string; member: Member } }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'IMPORT_DATA'; payload: AppData };

// Reducer
const dataReducer = (state: AppData, action: Action): AppData => {
  const newState = { ...state, lastUpdated: new Date().toISOString() };

  switch (action.type) {
    case 'LOAD_DATA':
    case 'IMPORT_DATA':
      return {
        ...initialState,
        ...action.payload,
        reminders: action.payload.reminders || [],
      };
    case 'ADD_CHITTY':
      return { ...newState, chitties: [...newState.chitties, action.payload] };
    case 'UPDATE_CHITTY':
      return {
        ...newState,
        chitties: newState.chitties.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CHITTY':
      return {
        ...newState,
        chitties: newState.chitties.filter((c) => c.id !== action.payload),
      };
    case 'ADD_MEMBER':
      return {
        ...newState,
        chitties: newState.chitties.map((c) =>
          c.id === action.payload.chittyId
            ? { ...c, members: [...c.members, action.payload.member] }
            : c
        ),
      };
    case 'ADD_PAYMENT':
      return {
        ...newState,
        chitties: newState.chitties.map((c) =>
          c.id === action.payload.chittyId
            ? { ...c, payments: [...c.payments, action.payload] }
            : c
        ),
      };
    case 'ADD_REMINDER':
      return { ...newState, reminders: [...newState.reminders, action.payload] };
    case 'DELETE_REMINDER':
      return {
        ...newState,
        reminders: newState.reminders.filter((r) => r.id !== action.payload),
      };
    default:
      return state;
  }
};

interface DataContextType {
  data: AppData;
  addChitty: (chitty: Omit<Chitty, 'id' | 'members' | 'payments'>) => void;
  updateChitty: (chitty: Chitty) => void;
  deleteChitty: (id: string) => void;
  addMember: (chittyId: string, member: Omit<Member, 'id' | 'joinedDate'>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  deleteReminder: (id: string) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, initialState);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const localData = await loadFromLocal();
      if (localData) {
        dispatch({ type: 'LOAD_DATA', payload: localData });
      }
    };
    loadData();
  }, []);

  // Auto-save on change
  useEffect(() => {
    if (data !== initialState) {
      saveToLocal(data);
    }
  }, [data]);

  const addChitty = (chittyData: Omit<Chitty, 'id' | 'members' | 'payments'>) => {
    const newChitty: Chitty = {
      ...chittyData,
      id: uuidv4(),
      members: [],
      payments: [],
    };
    dispatch({ type: 'ADD_CHITTY', payload: newChitty });
  };

  const updateChitty = (chitty: Chitty) => {
    dispatch({ type: 'UPDATE_CHITTY', payload: chitty });
  };

  const deleteChitty = (id: string) => {
    dispatch({ type: 'DELETE_CHITTY', payload: id });
  };

  const addMember = (chittyId: string, memberData: Omit<Member, 'id' | 'joinedDate'>) => {
    const newMember: Member = {
      ...memberData,
      id: uuidv4(),
      joinedDate: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MEMBER', payload: { chittyId, member: newMember } });
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
  };

  const addReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: uuidv4(),
    };
    dispatch({ type: 'ADD_REMINDER', payload: newReminder });
  };

  const deleteReminder = (id: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
  };

  const exportData = () => {
    exportToFile(data);
  };

  const importData = async (file: File) => {
    try {
      const importedData = await importFromFile(file);
      dispatch({ type: 'IMPORT_DATA', payload: importedData });
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        addChitty,
        updateChitty,
        deleteChitty,
        addMember,
        addPayment,
        addReminder,
        deleteReminder,
        exportData,
        importData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

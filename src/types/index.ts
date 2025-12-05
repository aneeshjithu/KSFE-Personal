export interface Member {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  joinedDate: string;
}

export interface Payment {
  id: string;
  chittyId: string;
  memberId: string;
  monthIndex: number; // 1 to totalMonths
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'missed';
  notes?: string;
}

export interface PropertyDetails {
  id: string;
  holderName: string;
  location: string;
  measurement: string;
  value: number;
  givenAmount: number;
  pendingAmount: number;
}

export interface Chitty {
  id: string;
  name: string;
  chittyNo?: string;
  branch: string;
  ownedBy?: string;
  totalMonths: number;
  installmentAmount: number;
  startDate: string;
  status: 'running' | 'completed' | 'running+auctioned';
  auctionAmount?: number;
  finalAmount?: number;
  properties?: PropertyDetails[];
  members: Member[];
  payments: Payment[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Reminder {
  id: string;
  chittyId: string;
  date: string;
  note?: string;
}

export interface AppData {
  version: string;
  lastUpdated: string;
  chitties: Chitty[];
  reminders: Reminder[];
}

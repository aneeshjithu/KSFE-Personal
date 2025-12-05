// Simple User interface for text file-based authentication
export interface User {
  email: string;
  uid: string;
}

// Storage key for session
const SESSION_KEY = 'ksfe_auth_session';

// Fetch credentials from text file
const fetchCredentials = async (): Promise<Map<string, string>> => {
  try {
    const response = await fetch('/credentials.txt');
    const text = await response.text();
    const credentials = new Map<string, string>();
    
    text.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const [email, password] = trimmedLine.split(':');
        if (email && password) {
          credentials.set(email.trim(), password.trim());
        }
      }
    });
    
    return credentials;
  } catch (error) {
    console.error("Error loading credentials", error);
    throw new Error("Failed to load credentials");
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const credentials = await fetchCredentials();
    const storedPassword = credentials.get(email);
    
    if (!storedPassword || storedPassword !== password) {
      throw new Error("Invalid email or password");
    }
    
    // Create user object
    const user: User = {
      email,
      uid: btoa(email) // Simple UID generation using base64 encoding
    };
    
    // Store session in localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error("Error signing in with email", error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Get current user from session
export const getCurrentUser = (): User | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      return JSON.parse(sessionData) as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user", error);
    return null;
  }
};

// Listen to auth state changes (simplified version)
export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  // Initial call
  callback(getCurrentUser());
  
  // Listen for storage changes (for multi-tab support)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) {
      callback(getCurrentUser());
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

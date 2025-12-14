import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole, UserActivityLog } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  activityLogs: UserActivityLog[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void; // New function for Admin editing
  deleteUser: (id: string) => void;
  updatePassword: (oldPass: string, newPass: string) => boolean;
  updateAvatar: (base64Image: string) => void;
  logAction: (action: string, details: string) => void;
  importLogs: (logs: UserActivityLog[]) => void; // New function for log import
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial hardcoded admin user
const INITIAL_ADMIN: User = {
  id: 'admin-001',
  name: 'Mohammed Muzamil',
  email: 'mohemadmuzamil@gmail.com',
  password: 'admin@123',
  role: 'ADMIN',
  department: 'Cyber Defense Command',
  avatar: 'AD'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([INITIAL_ADMIN]);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);

  // Check local storage for persistent session
  useEffect(() => {
    const storedUser = localStorage.getItem('scicds_user');
    const storedLogs = localStorage.getItem('scicds_logs');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    if (storedLogs) {
      setActivityLogs(JSON.parse(storedLogs));
    }
  }, []);

  // Helper to persist logs
  const saveLogs = (newLogs: UserActivityLog[]) => {
    setActivityLogs(newLogs);
    localStorage.setItem('scicds_logs', JSON.stringify(newLogs));
  };

  const logAction = (action: string, details: string, userOverride?: User) => {
    const user = userOverride || currentUser;
    if (!user) return;

    const newLog: UserActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip: '192.168.1.X' // Simulated local IP
    };

    const updatedLogs = [newLog, ...activityLogs];
    saveLogs(updatedLogs);
  };

  const importLogs = (logs: UserActivityLog[]) => {
    // Merge imported logs with existing ones, avoiding duplicates by ID
    const currentIds = new Set(activityLogs.map(l => l.id));
    const newLogs = logs.filter(l => !currentIds.has(l.id));
    const mergedLogs = [...newLogs, ...activityLogs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    saveLogs(mergedLogs);
    logAction('IMPORT_LOGS', `Imported ${newLogs.length} external logs`);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    
    if (user) {
      const safeUser = { ...user };
      delete safeUser.password; 
      
      setCurrentUser(safeUser);
      localStorage.setItem('scicds_user', JSON.stringify(safeUser));
      
      logAction('LOGIN', 'User logged in successfully', user);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
        logAction('LOGOUT', 'User logged out');
    }
    setCurrentUser(null);
    localStorage.removeItem('scicds_user');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
      avatar: newUser.name.substring(0, 2).toUpperCase()
    };
    setUsers([...users, user]);
    logAction('ADD_USER', `Added user: ${newUser.email}`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => {
        if (user.id === id) {
            return { ...user, ...updates };
        }
        return user;
    });
    setUsers(updatedUsers);
    
    // If the updated user is the current logged-in user, update session
    if (currentUser && currentUser.id === id) {
        const updatedCurrent = { ...currentUser, ...updates };
        // Don't store password in session
        const safeCurrent = { ...updatedCurrent };
        delete safeCurrent.password;
        
        setCurrentUser(safeCurrent);
        localStorage.setItem('scicds_user', JSON.stringify(safeCurrent));
    }

    logAction('UPDATE_USER', `Admin updated profile for user ID: ${id}`);
  };

  const deleteUser = (id: string) => {
    if (currentUser?.id === id) return;
    const userToDelete = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    logAction('DELETE_USER', `Deleted user: ${userToDelete?.email || id}`);
  };

  const updatePassword = (oldPass: string, newPass: string): boolean => {
    if (!currentUser) return false;
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return false;

    if (users[userIndex].password !== oldPass) {
        return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex].password = newPass;
    setUsers(updatedUsers);
    
    logAction('UPDATE_PASSWORD', 'User changed their password');
    return true;
  };

  const updateAvatar = (base64Image: string) => {
    if (!currentUser) return;
    updateUser(currentUser.id, { avatar: base64Image, isCustomAvatar: true });
    logAction('UPDATE_AVATAR', 'User updated profile picture');
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated: !!currentUser, 
      users,
      activityLogs,
      login, 
      logout,
      addUser,
      updateUser,
      deleteUser,
      updatePassword,
      updateAvatar,
      logAction,
      importLogs,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
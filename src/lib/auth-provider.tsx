
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAppStore } from './store';

// Context for our custom auth state
interface AuthContextType {
  isLoading: boolean;
  isSignedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  isSignedIn: false,
  user: null,
  login: () => {},
  logout: () => {}
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { login: storeLogin, logout: storeLogout } = useAppStore();
  
  // Mock login function for development
  const login = (userData: User) => {
    setUser(userData);
    setIsSignedIn(true);
    storeLogin(userData);
  };
  
  // Mock logout function for development
  const logout = () => {
    setUser(null);
    setIsSignedIn(false);
    storeLogout();
  };
  
  // For development, auto-login with a test user
  useEffect(() => {
    const mockUser: User = {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoUrl: '',
      createdAt: new Date()
    };
    
    // Uncomment the line below to auto-login for testing
    // login(mockUser);
  }, []);
  
  return (
    <AuthContext.Provider 
      value={{ 
        isLoading, 
        isSignedIn, 
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Component to require authentication
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useAuth();
  
  if (!isSignedIn) {
    return <AuthRequired />;
  }
  
  return <>{children}</>;
};

// Login/signup needed component
const AuthRequired: React.FC = () => {
  const { login } = useAuth();
  
  const handleSignIn = () => {
    // Create a mock user for testing
    const mockUser: User = {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoUrl: '',
      createdAt: new Date()
    };
    
    login(mockUser);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-cycle-primary">Sign In Required</h2>
          <p className="mt-2 text-gray-600">
            Please sign in to access your personal cycle insights
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full py-3 px-4 bg-cycle-primary text-white rounded-md font-medium hover:bg-cycle-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cycle-primary"
          >
            Sign In
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Your data stays private and secure
          </p>
        </div>
      </div>
    </div>
  );
};

// Auth status and profile button component
export const AuthStatus: React.FC = () => {
  const { isSignedIn, user, logout } = useAuth();
  
  if (isSignedIn && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{user.displayName}</span>
        <button
          onClick={logout}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <span className="sr-only">User menu</span>
          {user.photoUrl ? (
            <img src={user.photoUrl} alt={user.displayName} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cycle-primary text-white flex items-center justify-center">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </div>
    );
  }
  
  return (
    <button
      onClick={() => {
        const { login } = useAuth();
        // Create a mock user for testing
        const mockUser: User = {
          id: 'test-user-id',
          email: 'test@example.com',
          displayName: 'Test User',
          photoUrl: '',
          createdAt: new Date()
        };
        login(mockUser);
      }}
      className="px-4 py-2 bg-cycle-primary text-white rounded-md hover:bg-cycle-secondary transition-colors"
    >
      Sign In
    </button>
  );
};

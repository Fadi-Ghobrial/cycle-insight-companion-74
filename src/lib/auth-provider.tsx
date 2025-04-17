
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useUser,
  useClerk
} from '@clerk/clerk-react';
import { User } from '@/types';
import { useAppStore } from './store';

// The publishable key would normally come from environment variables
// For demo purposes, we're using a placeholder
const PUBLISHABLE_KEY = "pk_test_placeholder-key-replace-with-real-key";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Context for our custom auth state
interface AuthContextType {
  isLoading: boolean;
  isSignedIn: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isSignedIn: false,
  user: null
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Convert Clerk user to our app's User type
function convertClerkUser(clerkUser: any): User {
  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    displayName: clerkUser.fullName || clerkUser.firstName || '',
    photoUrl: clerkUser.imageUrl || '',
    createdAt: new Date(clerkUser.createdAt)
  };
}

// Auth provider component
export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthStateProvider>
        {children}
      </AuthStateProvider>
    </ClerkProvider>
  );
};

// Component to track auth state
const AuthStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { login, logout } = useAppStore();
  const [appUser, setAppUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn && user) {
      const convertedUser = convertClerkUser(user);
      setAppUser(convertedUser);
      login(convertedUser);
    } else {
      setAppUser(null);
      logout();
    }
  }, [isLoaded, isSignedIn, user, login, logout]);
  
  return (
    <AuthContext.Provider 
      value={{ 
        isLoading: !isLoaded, 
        isSignedIn: isSignedIn || false, 
        user: appUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Component to require authentication
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <AuthRequired />
      </SignedOut>
    </>
  );
};

// Login/signup needed component
const AuthRequired: React.FC = () => {
  const { openSignIn } = useClerk();
  
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
            onClick={() => openSignIn()}
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
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  
  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }
  
  return (
    <button
      onClick={() => openSignIn()}
      className="px-4 py-2 bg-cycle-primary text-white rounded-md hover:bg-cycle-secondary transition-colors"
    >
      Sign In
    </button>
  );
};

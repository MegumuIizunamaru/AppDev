import React, { useEffect } from 'react';
import { useRouter } from 'expo-router'; // Expo Router for navigation
import { useAuth } from './AuthContext'; // Access AuthContext
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; // Firebase Authentication

const CheckUserStatus: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Get the logged-in state from AuthContext
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/'); // Navigate to home page if logged in
    } else {
      router.push('/register'); // Navigate to register page if not logged in
    }
  }, [isLoggedIn, router]);

  return null; // Optionally, you can return a loading screen or something else while checking
};

export default CheckUserStatus;

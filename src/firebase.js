import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqV46aMnuk3OzF-VjQ_AtCiH3RxQ4RYUs",
  authDomain: "tapinx-e6a04.firebaseapp.com",
  projectId: "tapinx-e6a04",
  storageBucket: "tapinx-e6a04.firebasestorage.app",
  messagingSenderId: "898635790224",
  appId: "1:898635790224:web:0c2f5bcde9f20c27cb6515",
  measurementId: "G-95VQG4X74F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Clear any existing reCAPTCHA verifier
export const clearRecaptcha = () => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (error) {
      console.log('Error clearing reCAPTCHA:', error);
    }
    window.recaptchaVerifier = null;
  }
};

// Setup and render reCAPTCHA verifier
export const setupRecaptcha = (containerId) => {
  // Clear any existing verifier first
  clearRecaptcha();
  
  // Ensure container exists
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container with id "${containerId}" not found`);
  }

  // Create new verifier - for invisible reCAPTCHA, it renders automatically
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        clearRecaptcha();
      },
      'error-callback': (error) => {
        console.error('reCAPTCHA error:', error);
        clearRecaptcha();
      }
    });
    
    // For invisible reCAPTCHA, render() is called automatically, but we can verify it's ready
    // The verifier is ready to use after instantiation
    console.log('reCAPTCHA verifier initialized');
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    clearRecaptcha();
    throw error;
  }

  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber) => {
  // Ensure reCAPTCHA is set up
  const appVerifier = setupRecaptcha('recaptcha-container');
  
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    // Clear verifier on error to allow retry
    clearRecaptcha();
    throw error;
  }
};

export const verifyOTP = async (confirmationResult, otp) => {
  const result = await confirmationResult.confirm(otp);
  return result.user;
};

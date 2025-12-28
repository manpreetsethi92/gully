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

export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        window.recaptchaVerifier = null;
      }
    });
  }
  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber) => {
  const appVerifier = setupRecaptcha('recaptcha-container');
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  return confirmationResult;
};

export const verifyOTP = async (confirmationResult, otp) => {
  const result = await confirmationResult.confirm(otp);
  return result.user;
};

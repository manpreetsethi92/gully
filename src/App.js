import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/sonner";

// Pages
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/DashboardLayout";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
export const API = `${BACKEND_URL}/api`;

// Global axios interceptor for 401 handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect
      localStorage.removeItem("titly_token");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  // Initialize user from localStorage immediately to prevent redirect flash
  const getInitialUser = () => {
    try {
      const stored = localStorage.getItem("titly_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };
  
  const [user, setUser] = useState(() => getInitialUser());
  const [token, setToken] = useState(localStorage.getItem("titly_token"));
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Get stored user data to preserve profile_completed flag
          const storedUser = JSON.parse(localStorage.getItem("titly_user") || "{}");
          // Merge: backend data takes priority, but keep profile_completed if backend doesn't have it
          const mergedUser = {
            ...response.data,
            profile_completed: response.data.profile_completed || storedUser.profile_completed || false
          };
          setUser(mergedUser);
          localStorage.setItem("titly_user", JSON.stringify(mergedUser));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("titly_token");
          localStorage.removeItem("titly_user");
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem("titly_token", newToken);
    localStorage.setItem("titly_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("titly_token");
    localStorage.removeItem("titly_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    showAuthModal,
    openAuthModal,
    closeAuthModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Also check localStorage directly as fallback during initial load
  const hasStoredAuth = () => {
    const storedToken = localStorage.getItem("titly_token");
    const storedUser = localStorage.getItem("titly_user");
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.profile_completed === true;
      } catch {
        return false;
      }
    }
    return false;
  };

  if (loading) {
    // While loading, check localStorage to prevent flash redirect
    if (hasStoredAuth()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="spinner"></div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  // Check localStorage as fallback if state isn't ready yet (e.g., after login)
  // This handles the case where login() just updated localStorage but state hasn't propagated yet
  const storedAuthComplete = hasStoredAuth();
  const stateAuthComplete = isAuthenticated && user?.profile_completed;
  
  // Allow access if either state OR localStorage indicates valid auth
  if (!storedAuthComplete && !stateAuthComplete) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route 
              path="/app/*" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AuthProvider>
  );
}

export default App;

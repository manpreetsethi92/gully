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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Hydrate auth from localStorage AFTER mount (Safari bfcache fix)
  useEffect(() => {
    const hydrateAuth = () => {
      const storedToken = localStorage.getItem("titly_token");
      const storedUser = localStorage.getItem("titly_user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("titly_token");
          localStorage.removeItem("titly_user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    // Safari needs a tick after page restore
    setTimeout(hydrateAuth, 0);
  }, []);

  // Verify token with backend after hydration
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(prev => ({
            ...response.data,
            profile_completed: response.data.profile_completed || prev?.profile_completed || false
          }));
          localStorage.setItem("titly_user", JSON.stringify(response.data));
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("titly_token");
          localStorage.removeItem("titly_user");
          setToken(null);
          setUser(null);
        }
      }
    };

    if (!loading && token) {
      verifyToken();
    }
  }, [token, loading]);

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
    localStorage.setItem("titly_user", JSON.stringify(userData));
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated,
      showAuthModal,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route - simplified (router blocks until auth hydrated)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

// Separate component to access useAuth
const AppRoutes = () => {
  const { loading, isAuthenticated } = useAuth();

  // Block everything until auth is hydrated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {/* Redirect to dashboard if authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/app" replace /> : <LandingPage />}
          />
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
  );
};

export default App;

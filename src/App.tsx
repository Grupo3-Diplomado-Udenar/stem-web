import { useState, useEffect, useCallback } from "react";
import './App.css'
import StudentsPage from "./pages/StudentsPage";
import OrganizationPage from "./pages/OrganizationPage";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import { getUser } from "./api/auth";

interface AuthState {
  isAuthenticated: boolean | null;
  userType: 'student' | 'organization' | null;
}

function App() {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: null, userType: null });
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'student' | 'organization'>('landing');
  
  useEffect(() => {
    // Verificar si hay un usuario autenticado en localStorage
    const user = getUser();
    const newAuthState = {
      isAuthenticated: !!user,
      userType: user?.type ?? null,
    };
    const newPage = user ? (user.type === 'student' ? 'student' : user.type === 'organization' ? 'organization' : 'landing') : 'landing';
    
    setAuthState(newAuthState);
    setCurrentPage(newPage);
  }, []);

  const handleLoginSuccess = useCallback((type: 'student' | 'organization') => {
    setAuthState({ isAuthenticated: true, userType: type });
    if (type === 'student') {
      setCurrentPage('student');
    } else if (type === 'organization') {
      setCurrentPage('organization');
    }
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentPage('landing');
  }, []);
  
  if (authState.isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }
  
  // Mostrar página de landing si no está autenticado y no está en auth
  if (currentPage === 'landing') {
    const landingPageWithNav = <LandingPage onLoginSuccess={handleLoginSuccess} />;
    return landingPageWithNav;
  }

  // Mostrar página de autenticación
  if (currentPage === 'auth') {
    return <AuthPage onLoginSuccess={handleLoginSuccess} onBackClick={handleBackToLanding} />;
  }
  
  // Mostrar StudentsPage si el usuario es estudiante
  if (currentPage === 'student' || authState.userType === 'student') {
    return <StudentsPage />;
  }

  // Mostrar OrganizationPage si el usuario es organización
  if (currentPage === 'organization' || authState.userType === 'organization') {
    return <OrganizationPage />;
  }

  // Fallback a landing
  return <LandingPage onLoginSuccess={handleLoginSuccess} />;
}


export default App

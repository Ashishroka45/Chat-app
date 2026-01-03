import "./App.css"
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/Home";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar.jsx"
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";





const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // useEffect(()=)

  if (isCheckingAuth && !authUser) {
    return (
       <div className="flex justify-center items-center h-screen w-full">
      <Loader className="w-20 h-20 animate-spin" />
    </div>
    );
  }

  // console.log("Auth", { authUser });
  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ?<HomePage />:<Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage />:<Navigate to="/"/>} />
        
        <Route path="/login" element={!authUser ? <LoginPage />:<Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={ authUser ? <ProfilePage />:<Navigate to="/login"/>} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

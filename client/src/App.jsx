import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("AUTH_STORAGE_KEY"));
    if (auth?.token) {
      dispatch(setUser({ token: auth.token, user: auth.user }));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/auth/:id" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

export default App;

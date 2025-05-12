import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes } from "react-router";
import { Route } from "react-router";
import Home from "./pages/Home.tsx";
import Auth from "./pages/Auth.tsx";
import Courses from "./pages/Courses.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Profile from "./pages/Profile.tsx";
import DashBoard from "./pages/DashBoard.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

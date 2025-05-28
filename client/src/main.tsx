import { createRoot } from "react-dom/client";
import "./index.css";
import DefaultLayout from "./App.tsx";
import { BrowserRouter, Routes } from "react-router";
import { Route } from "react-router";
import Home from "./pages/public/Home.tsx";
import Auth from "./pages/public/Auth.tsx";
import Courses_admin from "./pages/admin/Courses.tsx";
import Courses_public from "./pages/public/Courses.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Profile from "./pages/public/Profile.tsx";
import DashBoard from "./pages/admin/DashBoard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { DashboardLayout } from "./components/ui/dashboard-layout.tsx";
import Students from "./pages/admin/Students.tsx";
import Enrollments from "./pages/admin/Enrollments.tsx";
import Admins from "./pages/admin/Admins.tsx";
import Informations from "./pages/admin/Informations.tsx";
import Enroll from "./pages/public/Enroll.tsx";
import MyEnrollemnts from "./pages/public/Enrollments.tsx";
import SuperProtectedRoute from "./components/SuperProtectedRoute.tsx";
import About from "./pages/public/About.tsx";
import Information from "./pages/public/Information.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/informacao" element={<Information />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cursos" element={<Courses_public />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/inscricoes" element={<MyEnrollemnts />} />
          <Route path="/inscrever-se" element={<Enroll />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route
            path="gerencia/estudantes"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="gerencia/cursos"
            element={
              <ProtectedRoute>
                <Courses_admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="gerencia/informacoes"
            element={
              <ProtectedRoute>
                <Informations />
              </ProtectedRoute>
            }
          />
          <Route
            path="gerencia/inscricoes"
            element={
              <ProtectedRoute>
                <Enrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="gerencia/administradores"
            element={
              <SuperProtectedRoute>
                <Admins />
              </SuperProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

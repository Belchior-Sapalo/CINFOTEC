import { Outlet } from "react-router";
import "./App.css";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";

export default function App() {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}


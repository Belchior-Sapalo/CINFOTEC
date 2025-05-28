import { Link, NavLink, useLocation } from "react-router";
import {
  FaBars,
  FaBook,
  FaHome,
  FaSearch,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { MdDashboard, MdSchool } from "react-icons/md";
import { Logo } from "./Logo";
import { GoToAuthButton, GoToProfileButton, LogoutButton } from "./Buttons";
import { links } from "../../shared/constants";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types/auth";

const getIcon = (label: string) => {
  switch (label) {
    case "Início":
      return <FaHome />;
    case "Cursos":
      return <FaBook />;
    case "Sobre":
      return <FaUsers />;
    case "Perfil":
      return <FaUserCircle />;
    case "Dashboard":
      return <MdDashboard />;
    case "Inscrições":
      return <MdSchool />;
  }
};

function MobileNavBar() {
  const [visible, setVisible] = useState<boolean>(false);
  const { state } = useAuth();
  const { pathname } = useLocation();

  const toggleNav = () => {
    setVisible((prev) => !prev);
  };

  return (
    <aside className="z-50 flex justify-between items-center border-b border-gray-200 h-18 px-4 sm:hidden">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 cursor-pointer" onClick={toggleNav}>
          <FaBars size={20} />
        </button>
        <Logo className="text-gray-500" />
      </div>
      <nav
        className={`fixed p-4 ${
          visible ? "left-0" : "left-[-100%]"
        } transition-all top-0 w-[100%] min-h-screen bg-white pt-8`}
      >
        <div className="absolute w-full top-2">
          <button
            className="relative left-[80%] flex items-center justify-center text-white bg-gray-500 p-2 rounded-full cursor-pointer"
            onClick={toggleNav}
          >
            <FaX />
          </button>
        </div>
        <ul className="flex flex-col gap-0.5">
          {links.map((link) => (
            <li
              className={`${
                !link.roles.includes(state.user?.role!) &&
                !link.roles.includes(Role.PUBLIC)
                  ? "hidden"
                  : "flex"
              } items-center`}
              key={link.id}
            >
              <i className="px-3 py-3.5 text-xl text-gray-500">
                {getIcon(link.label)}
              </i>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `w-full p-2.5 transition-all ${
                    isActive ? "text-gray-950" : " text-gray-500"
                  }`
                }
                onClick={() => setVisible(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="fixed bottom-5 text-gray-400 px-4 text-[12px]">
          &copy;CINFOTEC, 2025
        </p>
      </nav>

      <div className="flex gap-4">
        {pathname !== "/auth" && <GoToAuthButton />}
        {pathname !== "/perfil" && <GoToProfileButton />}
        <LogoutButton />
      </div>
    </aside>
  );
}

function DeskNavBar() {
  const { state } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="hidden sm:flex justify-between items-center border-b border-gray-200 h-18 px-8">
      <nav className="flex gap-8 items-center">
        <Logo className="text-gray-500 text-2xl" />

        <ul className="flex  gap-4 ">
          {links.map((link) => (
            <li
              key={link.id}
              className={`${
                !link.roles.includes(state.user?.role!) &&
                !link.roles.includes(Role.PUBLIC)
                  ? "hidden"
                  : "flex"
              } text-gray-500`}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "text-gray-950" : "text-gray-500"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex gap-2">
        {pathname !== "/auth" && <GoToAuthButton />}
        {pathname !== "/perfil" && <GoToProfileButton />}
        <LogoutButton />
      </div>
    </header>
  );
}

export default function NavBar() {
  return (
    <div>
      <MobileNavBar />
      <DeskNavBar />
    </div>
  );
}

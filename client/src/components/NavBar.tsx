import { Link, NavLink } from "react-router";
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
import { MdDashboard, MdLogout, MdSchool } from "react-icons/md";
import { Logo } from "./Logo";
import { GoToAuthButton, LogoutButton } from "./Buttons";
import { links } from "../shared/constants";
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
              } items-center border-b border-gray-400`}
              key={link.id}
            >
              <i className="px-3 py-3.5 text-2xl text-gray-500">
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
        <form action="" className="mt-8">
          <div className="flex bg-gray-200 py-2 px-4 rounded-2xl justify-between">
            <input
              type="text"
              className="outline-none"
              placeholder="Pesquisar"
            />
            <button
              className="text-white cursor-pointer bg-gray-500 p-2 rounded-full"
              onClick={toggleNav}
            >
              <FaSearch />
            </button>
          </div>
        </form>
        <p className="fixed bottom-5 text-gray-400 px-4 text-[12px]">
          &copy;CINFOTEC, 2025
        </p>
      </nav>

      <div className="flex gap-4">
        <GoToAuthButton className={`${
            state.isAuthenticated ? "hidden" : "flex"
          } text-white bg-gray-500 p-2 rounded-full cursor-pointer`} />
        <Link
          to="/profile"
          className={`${
            state.isAuthenticated ? "flex" : "hidden"
          } text-white bg-gray-500 p-2 rounded-full cursor-pointer`}
        >
          <FaUserCircle />
        </Link>
        <LogoutButton/>
      </div>
    </aside>
  );
}

function DeskNavBar() {
  const { state } = useAuth();
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
        <button className="text-white bg-gray-500 p-2 rounded-full cursor-pointer">
          <FaSearch />
        </button>
        <GoToAuthButton
          className={`${
            state.isAuthenticated ? "hidden" : "flex"
          } text-white bg-gray-500 p-2 rounded-full cursor-pointer`}
        />
        <Link
          to="/profile"
          className={`${
            state.isAuthenticated ? "flex" : "hidden"
          } text-white bg-gray-500 p-2 rounded-full cursor-pointer`}
        >
          <FaUserCircle />
        </Link>
        <LogoutButton/>
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

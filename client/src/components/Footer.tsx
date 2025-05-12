import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { links } from "../shared/constants";
import { Link } from "react-router";
import { Logo } from "./Logo";
import { MdMail } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types/auth";

export default function Footer() {
  const {state} = useAuth();
  return (
    <footer className="bg-gray-50 gap-4 grid p-4 sm:grid-cols-2">
      <div className="flex flex-col items-center mb-4">
        <Logo className="text-gray-700" />
        <p className="text-gray-400 text-[10px]">&copy;CINFOTEC, 2025</p>
        <div className="flex flex-col items-center gap-2 mt-4">
          <h2 className="text-[18px] text-gray-500">Contactos</h2>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-500 text-2xl hover:text-gray-600 transition-all"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-gray-500 text-2xl hover:text-gray-600 transition-all"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-500 text-2xl hover:text-gray-600 transition-all"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-500 text-2xl hover:text-gray-600 transition-all"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-4">
        <h2 className="text-[18px] text-gray-500">Navegação</h2>
        <ul className="flex flex-col items-center">
          {links.map((link) => (
            <li key={link.id} className={`${
                            !link.roles.includes(state.user?.role!) &&
                            !link.roles.includes(Role.PUBLIC)
                              ? "hidden"
                              : "flex"
                          }`}>
              <Link className="text-gray-500 text-[14px]" to={link.to}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <h5 className="text-center text-gray-500">Desenvolvedor</h5>
        <p className="text-gray-500 text-[12px] text-center flex items-center gap-1 justify-center">
            <i><MdMail/></i>
          sapalo.dev@gmail.com
        </p>

        <div className="flex justify-center gap-8">
          <a href="#" className="text-gray-500">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-500">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-500">
            <FaLinkedin />
          </a>
          <a href="#" className="text-gray-500">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}

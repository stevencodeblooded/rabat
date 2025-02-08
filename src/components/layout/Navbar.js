import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LocationMarkerIcon,
  ChatAltIcon,
  UserCircleIcon,
  LoginIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    closeMenu();
    navigate(path);
  };

  const navItems = [
    {
      name: "Map",
      path: "/map",
      icon: <LocationMarkerIcon className="w-6 h-6" />,
    },
    {
      name: "Agora",
      path: "/agora",
      icon: <ChatAltIcon className="w-6 h-6" />,
    },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                className="w-20"
                src="/rabat.png"
                alt="Rabat Urban Platform"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md flex items-center space-x-2"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
                  >
                    <LogoutIcon className="w-6 h-6" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md"
                >
                  <LoginIcon className="w-6 h-6" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md items-center space-x-2"
              onClick={closeMenu}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/profile"
                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md items-center space-x-2"
                onClick={closeMenu}
              >
                <UserCircleIcon className="w-6 h-6" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full text-left text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md items-center space-x-2"
              >
                <LogoutIcon className="w-6" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md items-center space-x-2"
              onClick={closeMenu}
            >
              <LoginIcon className="w-6 h-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  EyeIcon,
  EyeOffIcon,
  AtSymbolIcon,
  LockClosedIcon,
  GlobeAltIcon, 
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";
import { notificationService } from "../services/notificationService";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(data.email, data.password);
        notificationService.success("Login successful");
        navigate("/");
      } else {
        await register({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        notificationService.success("Registration successful");
        navigate("/profile");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      notificationService.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLoginOptions = [
    {
      name: "Google",
      icon: GlobeAltIcon,
      onClick: () => {
        // Implement Google OAuth
        console.log("Google Login");
      },
    },
    {
      name: "Facebook",
      icon: UserCircleIcon,
      onClick: () => {
        // Implement Facebook OAuth
        console.log("Facebook Login");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        {/* <div className="flex justify-center mb-8">
          <img
            className="w-20"
            src="/rabat.png"
            alt="Rabat Urban Platform"
          />
        </div> */}

        {/* Auth Card */}
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>

          {/* Toggle between Login and Register */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 ${
                isLogin
                  ? "bg-rabat-primary-500 text-white"
                  : "bg-gray-100 text-gray-700"
              } rounded-l-md transition-colors`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 ${
                !isLogin
                  ? "bg-rabat-primary-500 text-white"
                  : "bg-gray-100 text-gray-700"
              } rounded-r-md transition-colors`}
            >
              Register
            </button>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Name Field (only for registration) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...formRegister("name", {
                      required: !isLogin && "Name is required",
                      minLength: !isLogin && {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rabat-primary-500 focus:border-rabat-primary-500"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...formRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rabat-primary-500 focus:border-rabat-primary-500"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...formRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rabat-primary-500 focus:border-rabat-primary-500"
                  placeholder="********"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (only for registration) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...formRegister("confirmPassword", {
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rabat-primary-500 focus:border-rabat-primary-500"
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rabat-primary-500 hover:bg-rabat-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rabat-primary-500 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Forgot Password */}
          {isLogin && (
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-rabat-primary-500 hover:text-rabat-primary-600"
              >
                Forgot your password?
              </a>
            </div>
          )}

          {/* Social Login Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {socialLoginOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <option.icon className="h-5 w-5 mr-2 text-gray-500" />
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

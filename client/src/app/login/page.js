"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "sonner";
import CommodityLogo from "@/components/commodityLogo";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addLoginDetails } from "@/redux/reducerSlices/userSlice";
import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { isLoggedIn } = useSelector((state) => state.persisted.user);

  // Re-direct if user data in local storage
  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  const loginSchema = Yup.object().shape({
    emailId: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password is too long!")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        // Attempt to log in the user by calling the API
        const data = await loginUser(values);
        if (data) {
          dispatch(addLoginDetails(data));
          toast.success("Login Successful!", {
            description: "You have been successfully logged in.",
          });
          formik.resetForm(); // Clear the form after successful login
          // Quick fix for latest react version 19.1.0 with concurrent rendering
          // useEffect to redirect logged in users works before following redirection below
          // Due to which this component is unmounted before following redirection works
          // setTimeout(..., 0) defers execution until the current call stack and React's rendering lifecycle are complete,
          // avoiding race conditions and allowing routing to happen after the component has stabilized.
          setTimeout(() => {
            router.push(from || "/");
          }, 0);
        } else {
          // This case might be hit if the API returns an empty success response
          toast.error("Login Failed", {
            description:
              "An unexpected issue occurred during login. Please try again.",
          });
        }
      } catch (error) {
        console.warn("Login error:", error);
        toast.error("Login Failed", {
          description:
            "Invalid email or password. Please check your credentials.",
        });
      }
    },
  });

  const loginUser = async (values) => {
    const response = await axios.post(`/api/login`, values);
    return response.data;
  };

  // Helper function to render input fields
  const renderInput = (id, name, type, label, placeholder, icon) => (
    <div>
      <label
        htmlFor={id}
        className="flex gap-2 items-center text-sm font-medium text-gray-700 mb-1"
      >
        {icon}
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-4 py-2 border rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500
          ${
            formik.touched[name] && formik.errors[name]
              ? "border-red-500"
              : "border-gray-300"
          }
        `}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 text-sm text-red-600">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 font-inter">
      <div className="w-full max-w-lg mx-auto p-8 shadow-lg rounded-2xl bg-white/90 backdrop-blur-xs">
        {/* Logo Placeholder */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-center">
            <CommodityLogo
              onClick={() => {
                router.push("/");
              }}
              className="text-[#730000] cursor-pointer"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mr-8 text-gray-800 ">
            Login to Your Account
          </h2>
        </div>

        {/* The login form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {renderInput(
            "emailId",
            "emailId",
            "email",
            "Email Address",
            "Enter your email",
            <Mail className="size-6" />
          )}
          {renderInput(
            "password",
            "password",
            "password",
            "Password",
            "Enter your password",
            <Lock className="size-6" />
          )}

          {/* Submit Button */}
          <button
            className="w-full py-1 text-lg font-semibold bg-[#AF0000] text-white rounded-xl hover:bg-[#730000] transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting} // Disable if form is invalid or submitting
          >
            {formik.isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>
        <p className="text-end mt-4 -mb-4">
          Don&apos;t have an account?{" "}
          <Link
            className="text-blue-600 hover:text-blue-950"
            href={from ? `/register?from=${from}` : `/register`}
          >
            Register now...
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

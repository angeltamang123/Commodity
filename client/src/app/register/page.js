"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Button, Card, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import CommodityLogo from "@/components/commodityLogo";
import Link from "next/link";
import { IdCard, Lock, Mail, MapPin, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  let [emailTaken, setEmailTaken] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);

  // Re-direct if user data in local storage
  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, []);

  const registerSchema = Yup.object().shape({
    emailId: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),

    rePassword: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),

    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Required"),

    address: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),

    fullName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),

    gender: Yup.string()
      .oneOf(["Male", "Female", "Others"], "Please select a valid gender")
      .required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
      rePassword: "",
      phoneNumber: "",
      address: "",
      fullName: "",
      gender: "",
    },
    onSubmit: async (values) => {
      setEmailTaken(false);
      try {
        const data = await registerUser(values);
        toast.success("Registration Successful!", {
          description: "Your account has been created. You can now log in.",
        });
        formik.resetForm();
      } catch (error) {
        console.log(error);
        if (error.response.data === "Email is taken") {
          setEmailTaken(true);
          toast.error("Registration Failed", {
            description: "This email address is already registered.",
          });
        } else {
          console.error("Registration error:", error);
          toast.error("Registration Failed", {
            description:
              "An unexpected error occurred. Please try again later.",
          });
        }
      }
    },
    validationSchema: registerSchema,
  });

  const registerUser = async (values) => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      values
    );

    return data;
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
        className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
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
    // Main container for centering the form
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
      <div className="w-full max-w-lg mx-auto p-8 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-center">
            <CommodityLogo className="text-[#730000]" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mr-8">
            Register Your Account
          </h2>
        </div>

        {/* The registration form */}
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
          {renderInput(
            "rePassword",
            "rePassword",
            "password",
            "Confirm Password",
            "Re-enter your password",
            <Lock className="size-6" />
          )}
          {renderInput(
            "phoneNumber",
            "phoneNumber",
            "tel",
            "Phone Number",
            "e.g., 9842102155",
            <Phone className="size-6" />
          )}
          {renderInput(
            "fullName",
            "fullName",
            "text",
            "Full Name",
            "Enter your full name",
            <IdCard className="size-6" />
          )}
          {renderInput(
            "address",
            "address",
            "text",
            "Address",
            "Enter your address",
            <MapPin className="size-6" />
          )}

          {/* Gender Radio Group */}
          <div
            role="group"
            aria-labelledby="gender-label"
            className="space-y-2"
          >
            <div
              id="gender-label"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select your Gender
            </div>
            <div className="flex space-x-4">
              {["Male", "Female", "Others"].map((genderOption) => (
                <label
                  key={genderOption}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption}
                    checked={formik.values.gender === genderOption}
                    onChange={() =>
                      formik.setFieldValue("gender", genderOption)
                    }
                    onBlur={formik.handleBlur}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full"
                  />
                  <span className="ml-2 text-gray-700">{genderOption}</span>
                </label>
              ))}
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.gender}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            className="w-full py-1 text-lg font-semibold bg-[#AF0000] text-white rounded-xl hover:bg-[#730000] transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting} // Disable if form is invalid or submitting
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-end mt-4 -mb-4">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:text-blue-950" href={"/login"}>
            Login now...
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

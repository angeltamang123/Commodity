"use client";
import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Button, Card, Input } from "@nextui-org/react";

const login = () => {
  const loginSchema = Yup.object().shape({
    emailId: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
    },
    onSubmit: (values) => {
      loginUser(values);
    },
    validationSchema: loginSchema,
  });

  const loginUser = async (values) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        values
      );
      if (data) alert(data);
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="m-4 p-10">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="emailId"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="emailId"
              name="emailId"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.emailId}
              placeholder="Enter your email"
            />
            <p className="mt-1 text-sm text-red-600">{formik.errors.emailId}</p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Enter your password"
            />
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.password}
            </p>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default login;

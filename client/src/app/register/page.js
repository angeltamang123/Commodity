"use client";
import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Button, Card, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useState } from "react";

const SignupForm = () => {
  let [emailTaken, setEmailTaken] = useState("false");

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
  });

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
      rePassword: "",
      phoneNumber: "",
      address: "",
      fullName: "",
    },
    onSubmit: async (values) => {
      const data = await registerUser(values);
      debugger;
      if (data == "Email is taken") setEmailTaken(true);
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
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="flex m-4 p-10  ">
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="emailId">Email</label>
          <Input
            id="emailId"
            name="emailId"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.emailId}
          />
          <p className="text-sm text-red-600">{formik.errors.email}</p>
          <br />
          <label htmlFor="lastName">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <p className="text-sm text-red-600">{formik.errors.password}</p>
          <br />
          <label htmlFor="lastName">Re-enter Password</label>
          <Input
            id="rePassword"
            name="rePassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.rePassword}
          />
          <p className="text-sm text-red-600">{formik.errors.rePassword}</p>
          <br />
          <label htmlFor="email">Phone Number</label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
          />
          <p className="text-sm text-red-600">{formik.errors.phoneNumber}</p>
          <br />
          <label htmlFor="email">Full Name</label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.fullName}
          />
          <p className="text-sm text-red-600">{formik.errors.fullName}</p>
          <br />
          <label htmlFor="email">Address</label>
          <Input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.address}
          />
          <p className="text-sm text-red-600">{formik.errors.address}</p>
          <br />
          <RadioGroup
            id="gender"
            label="Select your Gender"
            onChange={(value) =>
              formik.setFieldValue("gender", value.target.value)
            }
            value={formik.values.gender}
          >
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Others">Others</Radio>
          </RadioGroup>
          <p className="text-sm text-red-600">{formik.errors.gender}</p>
          <br />
          {emailTaken && (
            <div className="flex">
              <p className="text-sm text-red-600">Email is Taken!!</p>
            </div>
          )}
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SignupForm;

// import React, { useState } from 'react'
// import {Badge, Avatar, Input} from "@nextui-org/react";
// import {Card, CardHeader, CardBody, CardFooter, Divider, Image,RadioGroup, Radio} from "@nextui-org/react";
// import Link from 'next/link';

// const Register = () => {
//   const [value, setValue] =useState(1)
//   return (
//     <div className='flex justify-center m-24'>
//      <Card className="max-w-[400px]">
//       <CardHeader className="flex gap-3">
//         <img src='/hustle_logo.jpg' width={90} height={30}/>
//         <div className="flex flex-col">
//           <p className="text-md">REGISTER</p>
//           <p className="text-small text-default-500">HUSTLE</p>
//         </div>
//       </CardHeader>
//       <Divider/>
//       <CardBody>
//       <Input placeholder='enter your email'/><br/>
//     <Input placeholder='enter your password' type='password'/><br/>
//     <Input placeholder='enter your phone number'/><br/>
//     <Input placeholder='enter your full name'/><br/>
//     <RadioGroup
//       label="Select gender"
//     >
//       <Radio value="buenos-aires">Male</Radio>
//       <Radio value="sydney">Female</Radio>
//       <Radio value="san-francisco">Others</Radio>
//     </RadioGroup>
//     <button className='bg-black p-2 m-2 text-white '>Register</button><br/>
//       </CardBody>
//       <Divider/>
//       <CardFooter>
//          Already have an account? <Link href='/'> Sign In </Link>  instead
//       </CardFooter>
//     </Card>

//     </div>
//   )
// }

// export default Register

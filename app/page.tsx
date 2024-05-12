"use client"
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .matches(/^[a-zA-Z]+$/, 'First name must contain only letters'),
  lastName: Yup.string()
    .required('Last name is required')
    .matches(/^[a-zA-Z]+$/, 'Last name must contain only letters'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone number must contain only numbers')
    .required('Phone number is required'),
});

export default function Home() {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const router = useRouter();
  const handleSubmit = async (values: FormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      // Call the API to save the form data
      const response = await fetch(`${process.env.API_SERVICE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.json();
      if (response.ok) {
        // Reset the form data
        setAlertMessage('');
        setSubmitting(false);
        router.push('/pages'); // Directly navigate to the new page
      } else {
        setAlertMessage(responseData.message || 'An error occurred while saving data');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <main className="rounded-lg bg-white p-8 shadow-lg border border-gray-300">
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting,handleChange }) => (
            <Form className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="border rounded-md text-black px-4 py-2 w-full"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="border rounded-md text-black px-4 py-2 w-full"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500" />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border rounded-md text-black px-4 py-2 w-full"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border rounded-md text-black px-4 py-2 w-full"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="border rounded-md text-black px-4 py-2 w-full"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    className="border rounded-md text-black px-4 py-2 w-full"
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
                  style={{ width: '200px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <br />

        {alertMessage && (
          <div className="alert text-[#991b1b]" style={{ textAlign: 'center' }}>
            {alertMessage}
          </div>
        )}
      </main>
    </div>
  );
}

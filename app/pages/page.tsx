"use client"
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface UpdateFormProps {
  user: User | null;
  onUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ user, onUpdate, onClose }) => {
  const validateForm = (values: User) => {
    const errors: { [key: string]: string } = {};
    if (!values.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!values.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!values.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    return errors;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl mb-4 text-center text-black">Update User</h2>
        <Formik
          initialValues={user || { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '' }}
          onSubmit={(values, { setSubmitting }) => {
            onUpdate(values);
            setSubmitting(false);
          }}
          validate={validateForm}
        >
          {({ isSubmitting }) => (
            <Form>
              <label className="block mb-2 text-black">
                First Name:
                <Field type="text" className="border rounded-md text-black px-4 py-2 w-full" name="firstName" />
                <ErrorMessage name="firstName" component="p" className="text-red-500" />
              </label>
              <label className="block mb-2 text-black">
                Last Name:
                <Field type="text" className="border rounded-md text-black px-4 py-2 w-full" name="lastName" />
                <ErrorMessage name="lastName" component="p" className="text-red-500" />
              </label>
              <label className="block mb-2 text-black">
                Email: <Field type="text" disabled={true} className="border rounded-md text-black px-4 py-2 w-full" name="email" />
              </label>
              <label className="block mb-2 text-black">
                Phone Number:
                <Field type="text" className="border rounded-md text-black px-4 py-2 w-full" name="phoneNumber" />
                <ErrorMessage name="phoneNumber" component="p" className="text-red-500" />
              </label>
              <div className="flex justify-center">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 text-black rounded-md hover:bg-blue-600 mr-2" disabled={isSubmitting}>Update</button>
                <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 text-black rounded-md hover:bg-gray-600">Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.API_SERVICE}/getusers`);
      if (response.ok) {
        const data = await response.json();
        if (data?.length < 1) {
          router.push('/');
        }
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdate = (user: User) => {
    setSelectedUser(user);
    setUpdateFormVisible(true);
  };

  const handleCloseForm = () => {
    setUpdateFormVisible(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`${process.env.API_SERVICE}/api/users/${updatedUser.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });
      const updatedUserData = await response.json();
      if (response.ok) {
        const updatedUsers = users.map(u => u.id === updatedUserData.id ? updatedUserData : u);
        setUsers(updatedUsers);
        setAlertMessage('');
        handleCloseForm();
        fetchUsers(); // Fetch users after updating
      } else {
        setAlertMessage(updatedUserData.message || 'An error occurred while saving data');
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const response = await fetch(`${process.env.API_SERVICE}/api/users/${email}`, {
        method: 'DELETE',
      });
      const responseJson = await response.json();
      console.log("responseJson", response, responseJson);

      if (response.ok) {
        const updatedUsers = users.filter(user => user.email !== email);
        setUsers(updatedUsers);
        fetchUsers();
        setAlertMessage('')
      } else {
        setAlertMessage(responseJson.message || 'An error occurred while delete data');
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <main className="rounded-lg bg-white p-8 shadow-lg w-full max-w-full lg:w-2/3 xl:w-3/4 mt-8 mb-8">
        <div style={{ textAlign: 'center' }}>
          <h1 className="text-2xl mb-4 text-black">User Details</h1>
        </div>
        <div className="overflow-x-auto">
          <div className="w-full overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-black">S.No</th>
                  <th className="px-4 py-2 text-black">First Name</th>
                  <th className="px-4 py-2 text-black">Last Name</th>
                  <th className="px-4 py-2 text-black">Email</th>
                  <th className="px-4 py-2 text-black">Phone Number</th>
                  <th className="px-4 py-2 text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2 text-black text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-black text-center">{user.firstName}</td>
                    <td className="border px-4 py-2 text-black text-center">{user.lastName}</td>
                    <td className="border px-4 py-2 text-black text-center">{user.email}</td>
                    <td className="border px-4 py-2 text-black text-center">{user.phoneNumber}</td>
                    <td className="border px-4 py-2 text-black text-center">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleUpdate(user)} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">Update</button>
                        <button onClick={() => handleDelete(user.email)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {alertMessage && (
          <div className="alert text-[#991b1b]" style={{ textAlign: 'center' }}>
            {alertMessage}
          </div>
        )}
      </main>
      {isUpdateFormVisible && (
        <UpdateForm
          user={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Home;

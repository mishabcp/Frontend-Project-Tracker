import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError(true);
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8080/api/register', formData);
            console.log('User registered successfully:', response.data);
            
            // Redirect to login page after successful signup using Link component
            window.location.href = '/login';
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                {passwordMatchError && <p className="text-red-500 text-sm mb-4">Passwords do not match</p>}
                <h1 className="text-4xl font-bold mb-4 text-center">Sign Up</h1>
                <h3 className='text-xl font-bold mb-6 text-center'>Create your Account</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full mb-2 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full mb-2 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <div className='w-full flex justify-center items-center'>
                        <button
                            className="w-2/3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none"
                            type="submit"
                        > Sign Up
                        </button>
                    </div>
                    <p className="mt-4 text-center">
                        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;

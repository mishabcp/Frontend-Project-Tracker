import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/api/login', { // Send POST request to /api/login
                username,
                password
            });

            console.log('Login response:', response.data);
            const userId = response.data.userId; // Store user ID
            // Redirect to TodoList page with user ID
            window.location.href = `/Projects/${userId}`;
        } catch (error) {
            console.error('Login error:', error.response.data);
            // Handle login error (e.g., display error message)
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-4xl font-bold mb-4 text-center">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="w-2/3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/" className="text-blue-500">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
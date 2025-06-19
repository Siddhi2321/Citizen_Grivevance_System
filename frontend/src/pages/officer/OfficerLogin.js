import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import { inputStyle, buttonStyle } from '../../styles/common';
import Header from '../../components/common/Header';
import MessagePopup from '../../components/common/MessagePopup';

const OfficerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage('Please fill in all fields');
            setShowMessage(true);
            return;
        }

        try {
            // TODO: Replace with actual MongoDB API call
            // const response = await fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            
            // For now, simulate authentication based on email
            let userType = 'officer';
            let userName = email;
            
            // Check if email contains 'admin' to determine user type
            if (email.toLowerCase().includes('admin')) {
                userType = 'admin';
                userName = email.replace('@', ' (Admin)');
            }

            // Store authentication data in localStorage for session management
            localStorage.setItem('userType', userType);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', email);
            
            // Navigate based on user type
            if (userType === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/officer/dashboard');
            }

        } catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed. Please try again.');
            setShowMessage(true);
        }
    };

    return (
        <div style={pageContainer}>
            <Header />
            <div style={mainContentStyle}>
                <div style={{
                    maxWidth: 400,
                    margin: '0 auto',
                    padding: '40px',
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Officer/Admin Login</h2>
                    
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            placeholder="Enter your email"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Use any email. If email contains "admin", you'll be logged in as admin.
                        </small>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            placeholder="Enter your password"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Any password will work for now.
                        </small>
                    </div>

                    <button
                        onClick={handleLogin}
                        style={buttonStyle}
                    >
                        Login
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
            {showMessage && (
                <MessagePopup
                    message={message}
                    onClose={() => setShowMessage(false)}
                />
            )}
        </div>
    );
};

export default OfficerLogin; 
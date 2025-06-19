import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { buttonStyle } from '../../styles/common';
import MessagePopup from './MessagePopup';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    const userType = localStorage.getItem('userType');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userName = localStorage.getItem('userName');
    
    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('citizenEmail');
        localStorage.removeItem('officerEmail');
        setShowLogoutConfirm(false);
        navigate('/');
    };

    return (
        <div style={{
            width: '100%',
            height: 80,
            background: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 40px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div 
                onClick={() => navigate('/')}
                style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Citizen Grievance Portal
            </div>

            <div style={{ 
                display: 'flex', 
                gap: 16,
                alignItems: 'center',
                paddingRight: 30
            }}>
                {!isAuthenticated && (
                    <>
                        <button
                            onClick={() => navigate('/officer/login')}
                            style={buttonStyle}
                        >
                            Officer Login
                        </button>
                        <button
                            onClick={() => navigate('/citizen/login')}
                            style={buttonStyle}
                        >
                            Citizen Login
                        </button>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <div style={{ color: '#666' }}>
                            {userName}
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ ...buttonStyle, background: '#dc3545' }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>

            {showLogoutConfirm && (
                <MessagePopup
                    message="Are you sure you want to logout?"
                    onClose={() => setShowLogoutConfirm(false)}
                    showConfirm={true}
                    onConfirm={confirmLogout}
                />
            )}
        </div>
    );
};

export default Header; 
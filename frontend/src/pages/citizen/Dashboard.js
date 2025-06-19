import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import Navigation from '../../components/common/Navigation';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [userGrievances, setUserGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyGrievances = [
        {
          _id: 'GRV123456',
          title: 'Poor Road Condition on Main Street',
          description: 'Multiple potholes and broken pavement causing traffic issues.',
          category: 'Infrastructure',
          priority: 'High',
          status: 'In Progress',
          submittedDate: '2024-01-15T10:30:00Z',
          trackingId: 'TRK123456'
        },
        {
          _id: 'GRV123457',
          title: 'Street Light Not Working',
          description: 'Street light at the corner of Oak and Pine streets has been non-functional.',
          category: 'Infrastructure',
          priority: 'Medium',
          status: 'Resolved',
          submittedDate: '2024-01-10T14:20:00Z',
          trackingId: 'TRK123457'
        },
        {
          _id: 'GRV123458',
          title: 'Garbage Collection Delays',
          description: 'Regular garbage collection has been delayed by 2-3 days consistently.',
          category: 'Sanitation',
          priority: 'Medium',
          status: 'Pending',
          submittedDate: '2024-01-20T09:15:00Z',
          trackingId: 'TRK123458'
        }
      ];
      setUserGrievances(dummyGrievances);
      setLoading(false);
    }, 1500);
  }, []);

  // Redirect if not logged in as citizen
  if (!userType || userType !== 'citizen') {
    navigate('/citizen/login');
    return null;
  }

  const handleReopenGrievance = (grievanceId) => {
    // Navigate to reopening page
    navigate(`/citizen/reopen/${grievanceId}`);
  };

  const handleTrackGrievance = (trackingId) => {
    // Navigate to tracking page
    navigate(`/track/${trackingId}`);
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const statusStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: status === 'Pending' ? '#fff3cd' : 
                    status === 'In Progress' ? '#cce5ff' : 
                    status === 'Resolved' ? '#d4edda' : '#f8d7da',
    color: status === 'Pending' ? '#856404' : 
           status === 'In Progress' ? '#004085' : 
           status === 'Resolved' ? '#155724' : '#721c24'
  });

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const trackButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const reopenButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ffc107',
    color: '#212529'
  };

  const statsCardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    flex: 1,
    minWidth: '150px'
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading your grievances...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: userGrievances.length,
    resolved: userGrievances.filter(g => g.status === 'Resolved').length,
    inProgress: userGrievances.filter(g => g.status === 'In Progress').length,
    pending: userGrievances.filter(g => g.status === 'Pending').length
  };

  return (
    <div style={pageContainer}>
      <Navigation />
      <div style={mainContentStyle}>
        <h1 style={{ fontSize: 40, fontFamily: 'Roboto', fontWeight: 700, marginBottom: '10px' }}>
          Welcome Back!
        </h1>
        <p style={{ fontSize: 16, color: '#6c757d', marginBottom: '30px' }}>
          Track your submitted grievances and their current status
        </p>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={statsCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Grievances</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#007bff' }}>{stats.total}</div>
          </div>
          <div style={statsCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Resolved</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#28a745' }}>{stats.resolved}</div>
          </div>
          <div style={statsCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>In Progress</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffc107' }}>{stats.inProgress}</div>
          </div>
          <div style={statsCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Pending</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc3545' }}>{stats.pending}</div>
          </div>
        </div>

        {/* Your Grievances */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: 600, marginBottom: '20px' }}>
            Your Grievances
          </h2>
          {userGrievances.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '20px' }}>
                You haven't submitted any grievances yet.
              </p>
              <button 
                style={{ ...trackButtonStyle, fontSize: '14px', padding: '12px 24px' }}
                onClick={() => navigate('/submit')}
              >
                Submit Your First Grievance
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {userGrievances.map((grievance) => (
                <div key={grievance._id} style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        {grievance.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>
                        {grievance.description}
                      </p>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#6c757d' }}>
                          Category: {grievance.category}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6c757d' }}>
                          Priority: {grievance.priority}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6c757d' }}>
                          Submitted: {new Date(grievance.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <span style={statusStyle(grievance.status)}>
                        {grievance.status}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          style={trackButtonStyle}
                          onClick={() => handleTrackGrievance(grievance.trackingId)}
                        >
                          Track
                        </button>
                        {grievance.status === 'Resolved' && (
                          <button 
                            style={reopenButtonStyle}
                            onClick={() => handleReopenGrievance(grievance._id)}
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: 600, marginBottom: '20px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <button 
              style={{ 
                ...trackButtonStyle, 
                width: '100%', 
                padding: '15px', 
                fontSize: '14px',
                display: 'block',
                textAlign: 'center'
              }}
              onClick={() => navigate('/submit')}
            >
              Submit New Grievance
            </button>
            <button 
              style={{ 
                ...trackButtonStyle, 
                width: '100%', 
                padding: '15px', 
                fontSize: '14px',
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#6c757d'
              }}
              onClick={() => navigate('/track')}
            >
              Track by ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard; 
import React, { useState, useEffect } from 'react';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import Navigation from '../../components/common/Navigation';

const AdminDashboard = () => {
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [pendingAcceptances, setPendingAcceptances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyPendingAssignments = [
        {
          _id: 'GRV123461',
          title: 'Street Light Repair Needed',
          category: 'Infrastructure',
          priority: 'Medium',
          submittedDate: '2024-01-25T11:30:00Z',
          citizen: 'Jane Smith'
        },
        {
          _id: 'GRV123462',
          title: 'Garbage Collection Schedule Issue',
          category: 'Sanitation',
          priority: 'High',
          submittedDate: '2024-01-26T09:15:00Z',
          citizen: 'Mike Johnson'
        },
        {
          _id: 'GRV123463',
          title: 'Public Park Maintenance',
          category: 'Recreation',
          priority: 'Low',
          submittedDate: '2024-01-27T14:20:00Z',
          citizen: 'Sarah Wilson'
        }
      ];

      const dummyPendingAcceptances = [
        {
          _id: 'GRV123456',
          title: 'Poor Road Condition on Main Street',
          category: 'Infrastructure',
          assignedOfficer: 'Officer Smith',
          resolvedDate: '2024-01-28T16:45:00Z',
          resolutionNotes: 'Road repairs completed. All potholes filled and pavement restored.'
        },
        {
          _id: 'GRV123457',
          title: 'Street Light Not Working',
          category: 'Infrastructure',
          assignedOfficer: 'Officer Brown',
          resolvedDate: '2024-01-29T10:30:00Z',
          resolutionNotes: 'Faulty street light replaced with new LED fixture.'
        }
      ];

      setPendingAssignments(dummyPendingAssignments);
      setPendingAcceptances(dummyPendingAcceptances);
      setLoading(false);
    }, 1500);
  }, []);

  const handleAssignGrievance = (grievanceId, officerId) => {
    // Simulate API call
    console.log('Assigning grievance:', grievanceId, 'to officer:', officerId);
    setPendingAssignments(prev => prev.filter(g => g._id !== grievanceId));
  };

  const handleAcceptResolution = (grievanceId) => {
    // Simulate API call
    console.log('Accepting resolution for grievance:', grievanceId);
    setPendingAcceptances(prev => prev.filter(g => g._id !== grievanceId));
  };

  const handleRejectResolution = (grievanceId) => {
    // Simulate API call
    console.log('Rejecting resolution for grievance:', grievanceId);
    setPendingAcceptances(prev => prev.filter(g => g._id !== grievanceId));
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#212529'
  };

  const statusStyle = (priority) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: priority === 'High' ? '#f8d7da' : 
                    priority === 'Medium' ? '#fff3cd' : '#d4edda',
    color: priority === 'High' ? '#721c24' : 
           priority === 'Medium' ? '#856404' : '#155724'
  });

  const buttonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px'
  };

  const assignButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const acceptButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <Navigation />
      <div style={mainContentStyle}>
        <h1 style={{ fontSize: 40, fontFamily: 'Roboto', fontWeight: 700, marginBottom: '10px' }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 16, color: '#6c757d', marginBottom: '30px' }}>
          Manage grievance assignments and review resolutions
        </p>

        {/* Pending Assignments */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: 600, marginBottom: '20px' }}>
            Pending Assignments ({pendingAssignments.length})
          </h2>
          {pendingAssignments.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#6c757d' }}>No pending assignments.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Grievance ID</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Submitted Date</th>
                  <th style={thStyle}>Citizen</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAssignments.map((grievance) => (
                  <tr key={grievance._id}>
                    <td style={tdStyle}>{grievance._id.slice(-8)}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '500' }}>{grievance.title}</div>
                    </td>
                    <td style={tdStyle}>{grievance.category}</td>
                    <td style={tdStyle}>
                      <span style={statusStyle(grievance.priority)}>
                        {grievance.priority}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(grievance.submittedDate).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>{grievance.citizen}</td>
                    <td style={tdStyle}>
                      <select 
                        style={{ padding: '4px 8px', marginRight: '8px', fontSize: '12px' }}
                        onChange={(e) => handleAssignGrievance(grievance._id, e.target.value)}
                      >
                        <option value="">Select Officer</option>
                        <option value="officer1">Officer Smith</option>
                        <option value="officer2">Officer Brown</option>
                        <option value="officer3">Officer Davis</option>
                      </select>
                      <button 
                        style={assignButtonStyle}
                        onClick={() => handleAssignGrievance(grievance._id, 'selected')}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pending Acceptances */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: 600, marginBottom: '20px' }}>
            Pending Acceptances ({pendingAcceptances.length})
          </h2>
          {pendingAcceptances.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#6c757d' }}>No pending acceptances.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Grievance ID</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Assigned Officer</th>
                  <th style={thStyle}>Resolved Date</th>
                  <th style={thStyle}>Resolution Notes</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAcceptances.map((grievance) => (
                  <tr key={grievance._id}>
                    <td style={tdStyle}>{grievance._id.slice(-8)}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '500' }}>{grievance.title}</div>
                    </td>
                    <td style={tdStyle}>{grievance.category}</td>
                    <td style={tdStyle}>{grievance.assignedOfficer}</td>
                    <td style={tdStyle}>
                      {new Date(grievance.resolvedDate).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ maxWidth: '200px', fontSize: '12px' }}>
                        {grievance.resolutionNotes}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <button 
                        style={acceptButtonStyle}
                        onClick={() => handleAcceptResolution(grievance._id)}
                      >
                        Accept
                      </button>
                      <button 
                        style={rejectButtonStyle}
                        onClick={() => handleRejectResolution(grievance._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Grievances</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#007bff' }}>156</div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Resolved</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>142</div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>In Progress</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>11</div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Pending</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#dc3545' }}>3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
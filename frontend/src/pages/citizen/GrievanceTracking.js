import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailBlock from '../../components/common/DetailBlock';
import { pageContainer } from '../../styles/layout';

const ActionLink = ({ text, onClick }) => (
  <div
    style={{
      fontSize: 18,
      cursor: 'pointer',
      color: '#007BFF',
      textDecoration: 'underline'
    }}
    onClick={onClick}
  >
    {text}
  </div>
);

const GrievanceTracking = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual fetch later
  const grievance = {
    id: trackingId,
    date: 'May 25, 2025',
    category: 'Sanitation',
    description:
      'The public sanitation facility is not maintained and has become a health concern.',
    location: 'Dehu Phata, Alandi',
    status: 'Under Review',
    officer: 'Officer Hanumant Kakde',
    lastUpdated: 'May 27, 2025',
    resolution: 'May 31, 2025'
  };

  return (
    <div style={{
      ...pageContainer,
      maxWidth: 1200,
      margin: '80px auto',
      padding: '40px',
      background: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: 12,
      fontFamily: 'Roboto, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: 36, marginBottom: 32 }}>
        Grievance Tracking
      </h1>

      <div>
        <h2 style={{ fontSize: 28, marginBottom: 16 }}>Grievance Details</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
          <DetailBlock title="Grievance ID" value={grievance.id} />
          <DetailBlock title="Submission Date" value={grievance.date} />
          <DetailBlock title="Category" value={grievance.category} />
          <DetailBlock title="Location" value={grievance.location} />
        </div>
        <div style={{ marginTop: 24 }}>
          <DetailBlock title="Description" value={grievance.description} />
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 28, marginBottom: 16 }}>Processing Status</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
          <DetailBlock title="Current Status" value={grievance.status} />
          <DetailBlock title="Assigned Officer" value={grievance.officer} />
          <DetailBlock title="Last Updated Date" value={grievance.lastUpdated} />
          <DetailBlock title="Expected Resolution Time" value={grievance.resolution} />
        </div>
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 60 }}>
        <ActionLink text="Refresh Status" onClick={() => window.location.reload()} />
        <ActionLink text="Back to Home" onClick={() => navigate('/')} />
        <ActionLink text="Contact Support" onClick={() => alert('Support clicked')} />
      </div>
    </div>
  );
};

export default GrievanceTracking; 
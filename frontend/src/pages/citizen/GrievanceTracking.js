import React, { useEffect, useState } from 'react';
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
  const [grievance, setGrievance] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/complaints/${trackingId}`);
        const data = await response.json();

        if (response.ok) {
          const g = data.complaint;
          setGrievance({
            id: g.grievanceId,
            date: new Date(g.submittedAt).toLocaleDateString(),
            category: g.category,
            description: g.description,
            location: `${g.location.addressLine}, ${g.location.city}`,
            status: g.status,
            officer: g.officer ? `${g.officer.name} (${g.officer.department})` : 'Not Assigned',
            lastUpdated: new Date(g.updatedAt).toLocaleDateString(),
            resolution: 'TBD', // You can update this when backend gives ETA
          });
        } else {
          alert(data.message || 'Could not fetch grievance');
        }
      } catch (error) {
        console.error('Error fetching grievance:', error);
        alert('Error fetching grievance data.');
      } finally {
        setLoading(false);
      }
    };

    const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/check-user-session", {
        method: "GET",
        credentials: "include",
      });
      setIsLoggedIn(res.ok); // true if 200 OK
    } catch (err) {
      console.error("Session check failed", err);
    }
  };


    if (trackingId){
      fetchGrievance();
      checkSession();
    } 
  }, [trackingId]);

  if (loading) return <div style={{ padding: 40 }}>Loading grievance...</div>;
  if (!grievance) return <div style={{ padding: 40 }}>Grievance not found.</div>;

  return (
    <div
      style={{
        ...pageContainer,
        maxWidth: 1200,
        margin: "80px auto",
        padding: "40px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: 12,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: 36, marginBottom: 32 }}>
        Grievance Tracking
      </h1>

      <div>
        <h2 style={{ fontSize: 28, marginBottom: 16 }}>Grievance Details</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
          <DetailBlock title="Current Status" value={grievance.status} />
          <DetailBlock title="Assigned Officer" value={grievance.officer} />
          <DetailBlock
            title="Last Updated Date"
            value={grievance.lastUpdated}
          />
          <DetailBlock
            title="Expected Resolution Time"
            value={grievance.resolution}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <ActionLink
          text="Refresh Status"
          onClick={() => window.location.reload()}
        />
        <ActionLink
          text="Back to Home"
          onClick={() => navigate(isLoggedIn ? "/citizen/dashboard" : "/")}
        />
        <ActionLink
          text="Contact Support"
          onClick={() => alert("Support clicked")}
        />
      </div>
    </div>
  );
};

export default GrievanceTracking; 
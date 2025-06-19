import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import Navigation from '../../components/common/Navigation';

const OfficerGrievanceDetails = () => {
 const { grievanceId } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/officer/grievance/${grievanceId}`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();

        if (res.ok) setGrievance(data.grievance);
        else alert(data.message || "Failed to fetch details");
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Server error fetching details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [grievanceId]);

  const handleFileChange = (e) => {
    setEvidenceFile(e.target.files[0]);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/officer/grievance/${grievanceId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: updateStatus, notes: updateNotes })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Status updated successfully");
        setGrievance(data.grievance);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Server error during status update.");
    }
    setUpdateStatus('');
    setUpdateNotes('');
  };

  const handleSubmitEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceFile) return;

    const formData = new FormData();
    formData.append("file", evidenceFile);

    try {
      const res = await fetch(`http://localhost:5000/api/officer/grievance/${grievanceId}/evidence`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        alert("Evidence uploaded successfully");
        setGrievance(data.grievance);
      } else {
        alert(data.message || "Failed to upload evidence");
      }
    } catch (err) {
      console.error("Evidence upload error:", err);
      alert("Server error during evidence upload.");
    }
    setEvidenceFile(null);
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
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '15px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading grievance details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <Navigation />
      <div style={mainContentStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: 32, fontFamily: "Roboto", fontWeight: 700 }}>
            Grievance Details
          </h1>
          <span style={statusStyle(grievance.status)}>{grievance.status}</span>
        </div>

        {/* Grievance Information */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Grievance Information
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Title
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {grievance.title}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Category
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {grievance.category}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Priority
              </h3>
              <span style={statusStyle(grievance.priority)}>
                {grievance.priority}
              </span>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Submitted Date
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {new Date(grievance.submittedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Assigned Date
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {new Date(grievance.assignedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Location
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {grievance.location.address}
              </p>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Description
            </h3>
            <p
              style={{ fontSize: "14px", color: "#495057", lineHeight: "1.6" }}
            >
              {grievance.description}
            </p>
          </div>
        </div>

        {/* Citizen Information */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Citizen Information
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Email
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {grievance.citizen}
              </p>
            </div>
          </div>
        </div>

        {/* Evidence */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Evidence
          </h2>
          {grievance?.evidence && grievance.evidence.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {grievance.evidence.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.description}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "15px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "5px",
                      }}
                    >
                      {item.description}
                    </p>
                    <p style={{ fontSize: "12px", color: "#6c757d" }}>
                      Uploaded by {item.uploadedBy} on{" "}
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "14px", color: "#6c757d" }}>
              No evidence uploaded yet.
            </p>
          )}
        </div>

        {/* Status Updates */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Status Updates
          </h2>
          <div style={{ marginBottom: "20px" }}>
            {grievance?.updates && grievance.updates.length > 0 ? (
              grievance.updates.map((update, index) => (
                <div
                  key={index}
                  style={{
                    padding: "15px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {update.officer}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6c757d" }}>
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span style={statusStyle(update.status)}>
                    {update.status}
                  </span>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#495057",
                      marginTop: "8px",
                    }}
                  >
                    {update.notes}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "#6c757d" }}>
                No status updates yet.
              </p>
            )}
          </div>
        </div>

        {/* Add Status Update */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Add Status Update
          </h2>
          <form onSubmit={handleSubmitUpdate}>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                Status:
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                Notes:
              </label>
              <textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                style={textareaStyle}
                placeholder="Add update notes..."
                required
              />
            </div>
            <button type="submit" style={buttonStyle}>
              Submit Update
            </button>
          </form>
        </div>

        {/* Submit Evidence */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Submit Evidence
          </h2>
          <form onSubmit={handleSubmitEvidence}>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                Upload File:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                style={inputStyle}
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={!evidenceFile}>
              Submit Evidence
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficerGrievanceDetails; 
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pageContainer, mainContentStyle } from "../../styles/layout";
import Navigation from "../../components/common/Navigation";

const GrievanceReopen = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRemarks, setNewRemarks] = useState("");
  const [newEvidence, setNewEvidence] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/complaints/grievances/${grievanceId}`,
          {
            credentials: "include", // if using session auth
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch grievance");
        }

        setGrievance(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch grievance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [grievanceId]);

  const handleFileChange = (e) => {
    setNewEvidence(e.target.files[0]);
  };

  const handleSubmitReopen = async (e) => {
    e.preventDefault();

    if (!newRemarks.trim()) {
      alert("Please provide remarks for reopening the grievance.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("remarks", newRemarks);
      if (newEvidence) {
        formData.append("evidence", newEvidence); // File from input
      }

      const response = await fetch(
        `http://localhost:5000/api/complaints/${grievanceId}/reopen`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // if you're using sessions
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reopen grievance");
      }

      alert("Grievance reopened successfully!");
      navigate("/citizen/dashboard");
    } catch (error) {
      console.error("Error reopening grievance:", error);
      alert("Failed to reopen grievance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const statusStyle = (status) => ({
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor:
      status === "Pending"
        ? "#fff3cd"
        : status === "In Progress"
        ? "#cce5ff"
        : status === "Resolved"
        ? "#d4edda"
        : "#f8d7da",
    color:
      status === "Pending"
        ? "#856404"
        : status === "In Progress"
        ? "#004085"
        : status === "Resolved"
        ? "#155724"
        : "#721c24",
  });

  const buttonStyle = {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginRight: "10px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    marginBottom: "15px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "120px",
    resize: "vertical",
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading grievance details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!grievance) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Error loading grievance or grievance not found.</p>
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
            Reopen Grievance
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
            Grievance Details
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
                Tracking ID
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {grievance.grievanceId}
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
                Resolved Date
              </h3>
              <p style={{ fontSize: "14px", color: "#495057" }}>
                {grievance.resolvedDate
                  ? new Date(grievance.resolvedDate).toLocaleDateString()
                  : "Not available"}
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
              Original Description
            </h3>
            <p
              style={{ fontSize: "14px", color: "#495057", lineHeight: "1.6" }}
            >
              {grievance.description}
            </p>
          </div>
        </div>

        {/* Resolution Information */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Resolution Details
          </h2>
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Resolution Notes
            </h3>
            <p
              style={{ fontSize: "14px", color: "#495057", lineHeight: "1.6" }}
            >
              {grievance.resolutionNotes || "No resolution notes provided."}
            </p>
          </div>
        </div>

        {/* Previous Evidence */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Previous Evidence
          </h2>
          {grievance.attachments.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <img
                src={item.fileUrl} // ✅ correct key from backend
                alt={`evidence-${index}`}
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
                  Attachment #{index + 1}
                </p>
                <p style={{ fontSize: "12px", color: "#6c757d" }}>
                  Uploaded evidence
                </p>
              </div>
            </div>
          ))}
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
            Status History
          </h2>
          <div style={{ marginBottom: "20px" }}>
            {(grievance.logs || []).map((log, index) => (
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
                    {log.officerName || "Unknown"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6c757d" }}>
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <span style={statusStyle(log.status || "Updated")}>
                  {log.status || "Updated"}
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#495057",
                    marginTop: "8px",
                  }}
                >
                  {log.message || "No message provided."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reopen Form */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Reopen Grievance
          </h2>
          <form onSubmit={handleSubmitReopen}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Reason for Reopening *
              </label>
              <textarea
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
                style={textareaStyle}
                placeholder="Please explain why you want to reopen this grievance. Provide specific details about what issues remain unresolved..."
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                New Evidence (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                style={inputStyle}
              />
              <small style={{ color: "#6c757d", fontSize: "12px" }}>
                Upload photos, documents, or other evidence to support your
                reopening request.
              </small>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={buttonStyle} disabled={submitting}>
                {submitting ? "Submitting..." : "Reopen Grievance"}
              </button>
              <button
                type="button"
                style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
                onClick={() => navigate("/citizen/dashboard")}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrievanceReopen;

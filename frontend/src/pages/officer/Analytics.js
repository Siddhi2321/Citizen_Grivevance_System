import React, { useState, useEffect } from 'react';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import Navigation from '../../components/common/Navigation';

const OfficerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchOfficerStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/officer/stats", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch officer stats");
        return;
      }

      const extendedData = {
        ...data,
        averageResolutionTime: 4.2, // dummy for now
        categoryBreakdown: [
          { category: 'Infrastructure', count: 6, percentage: 40 },
          { category: 'Sanitation', count: 4, percentage: 27 },
          { category: 'Utilities', count: 3, percentage: 20 },
          { category: 'Recreation', count: 2, percentage: 13 }
        ],
        monthlyTrends: [
          { month: 'Jan', assigned: 5, resolved: 3 },
          { month: 'Feb', assigned: 4, resolved: 2 },
          { month: 'Mar', assigned: 6, resolved: 3 }
        ],
        performanceMetrics: {
          responseTime: '2.1 days',
          resolutionRate: '87%',
          satisfactionScore: '4.2/5'
        }
      };

      setAnalyticsData(extendedData);
    } catch (err) {
      console.error("Error fetching officer analytics:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchOfficerStats();
  }, []);

  const metricCardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    flex: 1,
    minWidth: '200px'
  };

  const chartContainerStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  };

  const progressBarStyle = (percentage) => ({
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px'
  });

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: '#007bff',
    transition: 'width 0.3s ease'
  });

  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading analytics data...</p>
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
          Analytics Dashboard
        </h1>
        <p style={{ fontSize: 16, color: '#6c757d', marginBottom: '30px' }}>
          Track your performance and grievance resolution metrics
        </p>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Assigned</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#007bff' }}>{analyticsData.totalAssigned}</div>
          </div>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Resolved</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>{analyticsData.resolved}</div>
          </div>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>In Progress</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>{analyticsData.in_progress}</div>
          </div>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Pending</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#dc3545' }}>{analyticsData.pending}</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Avg Resolution Time</h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#495057' }}>{analyticsData.averageResolutionTime} days</div>
          </div>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Response Time</h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#495057' }}>{analyticsData.performanceMetrics.responseTime}</div>
          </div>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Resolution Rate</h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#495057' }}>{analyticsData.performanceMetrics.resolutionRate}</div>
          </div>
          <div style={metricCardStyle}>
            <h3 style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Satisfaction Score</h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#495057' }}>{analyticsData.performanceMetrics.satisfactionScore}</div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div style={chartContainerStyle}>
          <h2 style={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: 600, marginBottom: '20px' }}>
            Monthly Trends
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            {analyticsData.monthlyTrends.map((trend, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{trend.month}</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  Assigned: {trend.assigned}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  Resolved: {trend.resolved}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerAnalytics;
// src/pages/Dashboard.jsx
import React from "react";
import { useSubjects } from "../context/SubjectContext";
import './Dashboard.css';

const Dashboard = () => {
  // First, get the entire context object
  const context = useSubjects();
  
  // Check if context exists before destructuring
  if (!context) {
    return (
      <div className="dashboard-error">
        Error: Subjects context not available. Make sure your app is wrapped with SubjectProvider.
      </div>
    );
  }

  // Now safely destructure
  const { subjects } = context;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Subjects Progress Section */}
      <section className="dashboard-subjects-section">
        <h2 className="dashboard-subjects-title">Subjects Progress</h2>

        {!subjects || subjects.length === 0 ? (
          <p className="dashboard-subjects-empty">No subjects added yet.</p>
        ) : (
          <div className="dashboard-subjects-list">
            {subjects.map((subject) => {
              // Calculate progress if not provided
              const progress = subject.progress ?? 
                (subject.tasks?.length 
                  ? Math.round(
                      (subject.tasks.filter(t => t.completed).length / 
                       subject.tasks.length) * 100
                    )
                  : 0);
              
              return (
                <div key={subject.slug}>
                  <div className="dashboard-subject-header">
                    <span className="dashboard-subject-title">
                      {subject.title}
                    </span>
                    <span className="dashboard-subject-progress">
                      {progress}%
                    </span>
                  </div>
                  <div className="dashboard-subject-progress-bar-container">
                    <div
                      className="dashboard-subject-progress-bar"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: subject.color || "#A78BFA",
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Placeholder sections */}
      <section className="dashboard-activity-section">
        <h2 className="dashboard-activity-title">Recent Activity</h2>
        <p className="dashboard-activity-empty">Coming Soon</p>
      </section>

      <section className="dashboard-actions-section">
        <h2 className="dashboard-actions-title">Quick Actions</h2>
        <p className="dashboard-actions-empty">Coming Soon</p>
      </section>
    </div>
  );
};

export default Dashboard;
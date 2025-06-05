// src/components/SubjectCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import './SubjectCard.css';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Gradient background based on color (light + transparent)
  const gradientBg = `linear-gradient(135deg, ${subject.color}33 0%, ${subject.color}cc 100%)`;

  return (
    <div
      className="subject-card relative cursor-pointer rounded-2xl p-4 shadow-md transition-all hover:scale-[1.02] select-none"
      style={{ background: gradientBg }}
      onClick={() => navigate(`/subjects/${subject.slug}`)}
      title={`${subject.title} (Credits: ${subject.credits})`}
    >
      <h3 className="subject-card-title text-lg font-bold text-clay-900">{subject.title}</h3>
      <p className="subject-card-credits text-sm text-clay-900/80 mt-1">Credits: {subject.credits}</p>
      <div className="subject-card-description">
        🎯 Target: {subject.targetGrade} | 📈 Estimated: {subject.estimatedGrade}
      </div>

      {/* Action Buttons - Always visible */}
      <div className="subject-card-actions absolute top-3 right-3 flex gap-3" onClick={(e) => e.stopPropagation()} // Prevent card click navigation
      >
        <button
          onClick={() => onEdit(subject)}
          title="Edit Subject"
          className="subject-card-edit-button flex items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-md p-2 transition-colors hover:bg-blue-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={`Edit ${subject.title}`}
        >
          <FiEdit2 size={18} />
        </button>

        <button
          onClick={() => {
            if (
              window.confirm(
                `Are you sure you want to delete the subject "${subject.title}"?`
              )
            ) {
              onDelete(subject.slug);
            }
          }}
          title="Delete Subject"
          className="subject-card-delete-button flex items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md p-2 transition-colors hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label={`Delete ${subject.title}`}
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;

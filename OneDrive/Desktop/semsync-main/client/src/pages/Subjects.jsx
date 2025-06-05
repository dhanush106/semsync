// src/pages/Subjects.jsx
import React, { useState } from "react";
import AddSubjectModal from "../components/AddSubjectModal";
import { useSubjects } from "../context/SubjectContext";
import SubjectCard from "../components/SubjectCard";
import './Subjects.css';

const Subjects = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubjectData, setEditSubjectData] = useState(null);
  const { subjects, deleteSubject } = useSubjects();

  const openAddModal = () => {
    setEditSubjectData(null);
    setModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditSubjectData(subject);
    setModalOpen(true);
  };

  const handleDelete = (slug) => {
    deleteSubject(slug);
  };

  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <h1 className="subjects-title">Subjects</h1>
        <button
          onClick={openAddModal}
          className="add-subject-button"
        >
          + Add Subject
        </button>
      </div>

      <AddSubjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editSubjectData}
      />

      {subjects.length === 0 ? (
        <p className="subjects-description">
          No subjects added yet. Click "Add Subject" to start.
        </p>
      ) : (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.slug}
              subject={subject}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;

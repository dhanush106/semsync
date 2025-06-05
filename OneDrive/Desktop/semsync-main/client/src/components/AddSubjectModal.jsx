// src/components/AddSubjectModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "../context/SubjectContext";

const gradeOptions = ["O", "A+", "A", "B+", "B", "C+", "C", "D", "Fail"];

const AddSubjectModal = ({ isOpen, onClose, editData }) => {
  const isEditMode = Boolean(editData);
  const [subjectName, setSubjectName] = useState("");
  const [color, setColor] = useState("#A78BFA");
  const [estimatedGrade, setEstimatedGrade] = useState("O");
  const [targetGrade, setTargetGrade] = useState("O");
  const [credits, setCredits] = useState(3);

  const { addSubject, editSubject } = useSubjects();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      setSubjectName(editData.title);
      setColor(editData.color);
      setEstimatedGrade(editData.estimatedGrade);
      setTargetGrade(editData.targetGrade);
      setCredits(editData.credits);
    } else {
      setSubjectName("");
      setColor("#A78BFA");
      setEstimatedGrade("O");
      setTargetGrade("O");
      setCredits(3);
    }
  }, [editData, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    const slug = subjectName.trim().toLowerCase().replace(/\s+/g, "-");

    const newSubject = {
      title: subjectName.trim(),
      slug,
      color,
      estimatedGrade,
      targetGrade,
      credits,
    };

    if (isEditMode) {
      editSubject(editData.slug, newSubject);
    } else {
      addSubject(newSubject);
    }

    // Navigate only if adding a new subject (optional)
    if (!isEditMode) {
      navigate(`/subjects/${slug}`);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-end p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-clay-100 p-6 shadow-clay-md overflow-y-auto max-h-[90vh]"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-clay-900">
                {isEditMode ? "Edit Subject" : "Add New Subject"}
              </h2>
              <button onClick={onClose} className="text-clay-600 hover:text-red-500">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject Name (e.g. Data Structures)"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full rounded-lg border border-clay-300 bg-clay-50 p-3 text-sm text-clay-800 shadow-inner outline-none focus:ring-2 focus:ring-clay-400"
                disabled={isEditMode} // Optional: prevent changing subject name when editing to keep slug consistent
              />

              <div className="flex items-center gap-4">
                <label className="text-sm text-clay-700">Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-16 rounded"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-clay-700">Estimated Grade</label>
                  <select
                    className="w-full rounded-lg border border-clay-300 bg-clay-50 p-2 text-sm shadow-inner"
                    value={estimatedGrade}
                    onChange={(e) => setEstimatedGrade(e.target.value)}
                  >
                    {gradeOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-clay-700">Target Grade</label>
                  <select
                    className="w-full rounded-lg border border-clay-300 bg-clay-50 p-2 text-sm shadow-inner"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                  >
                    {gradeOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-clay-700">Credits</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-clay-300 bg-clay-50 p-2 text-sm shadow-inner"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="mt-4 w-full rounded-lg bg-pastel-lavender px-4 py-2 text-sm font-semibold text-clay-900 shadow-md hover:bg-pastel-lavender/90"
              >
                {isEditMode ? "Save Changes" : "Add Subject"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSubjectModal;

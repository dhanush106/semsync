import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubjects } from "../context/SubjectContext";
import { motion, AnimatePresence } from "framer-motion";
import './SubjectListBar.css';

const SubjectListBar = () => {
  const { subjects } = useSubjects();
  const navigate = useNavigate();
  const { subjectSlug } = useParams();

  return (
    <nav className="subject-list-bar">
      <ul className="subject-list">
        {subjects.map((subj) => {
          const isActive = subj.slug === subjectSlug;

          return (
            <li key={subj.slug} className="subject-list-item">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="subject-list-link"
              >
                <motion.span
                  className="subject-list-link-text"
                >
                  {subj.title}
                </motion.span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabHighlight"
                    className="subject-list-link-background"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    style={{ zIndex: 1 }}
                  />
                )}
              </motion.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SubjectListBar;

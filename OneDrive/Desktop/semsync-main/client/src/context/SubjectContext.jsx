import React, { createContext, useContext, useState, useCallback } from "react";

const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([
    {
      slug: "math",
      title: "Mathematics",
      color: "#3b82f6",
      tasks: [],
    },
    {
      slug: "physics",
      title: "Physics",
      color: "#ef4444",
      tasks: [],
    },
  ]);

  // Add new subject
  const addSubject = useCallback((subject) => {
    setSubjects((prev) => [...prev, { ...subject, tasks: [] }]);
  }, []);

  // Edit subject by slug
  const editSubject = useCallback((slug, updatedSubject) => {
    setSubjects((prev) =>
      prev.map((subj) => (subj.slug === slug ? { ...updatedSubject, tasks: subj.tasks } : subj))
    );
  }, []);

  // Delete subject by slug
  const deleteSubject = useCallback((slug) => {
    setSubjects((prev) => prev.filter((subj) => subj.slug !== slug));
  }, []);

  // Add task to subject
  const addTask = useCallback((subjectSlug, task) => {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.slug === subjectSlug
          ? { ...subj, tasks: [...subj.tasks, task] }
          : subj
      )
    );
  }, []);

  // Edit task by id in subject
  const editTask = useCallback((subjectSlug, taskId, updatedTask) => {
    setSubjects((prev) =>
      prev.map((subj) => {
        if (subj.slug === subjectSlug) {
          return {
            ...subj,
            tasks: subj.tasks.map((t) =>
              t.id === taskId ? { ...t, ...updatedTask } : t
            ),
          };
        }
        return subj;
      })
    );
  }, []);

  // Delete task by id in subject
  const deleteTask = useCallback((subjectSlug, taskId) => {
    setSubjects((prev) =>
      prev.map((subj) => {
        if (subj.slug === subjectSlug) {
          return {
            ...subj,
            tasks: subj.tasks.filter((t) => t.id !== taskId),
          };
        }
        return subj;
      })
    );
  }, []);

  // Reorder tasks in a subject (for drag & drop)
  const reorderTasks = useCallback((subjectSlug, newTasks) => {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.slug === subjectSlug ? { ...subj, tasks: newTasks } : subj
      )
    );
  }, []);

  // Calculate progress for a subject
  const getSubjectProgress = useCallback((subjectSlug) => {
    const subject = subjects.find((s) => s.slug === subjectSlug);
    if (!subject || subject.tasks.length === 0) return 0;
    const completedTasks = subject.tasks.filter((t) => t.completed).length;
    return Math.round((completedTasks / subject.tasks.length) * 100);
  }, [subjects]);

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        addSubject,
        editSubject,
        deleteSubject,
        addTask,
        editTask,
        deleteTask,
        reorderTasks,
        getSubjectProgress,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);
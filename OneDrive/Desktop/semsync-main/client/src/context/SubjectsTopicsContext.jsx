import React, { createContext, useContext, useState } from "react";

const SubjectsTopicsContext = createContext();

export const SubjectsTopicsProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([
    {
      slug: "math",
      title: "Mathematics",
      tasks: [],
    },
    {
      slug: "physics",
      title: "Physics",
      tasks: [],
    },
  ]);

  const addTask = (slug, task) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.slug === slug
          ? { ...subject, tasks: [...subject.tasks, task] }
          : subject
      )
    );
  };

  const editTask = (slug, taskId, newTaskData) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.slug === slug
          ? {
              ...subject,
              tasks: subject.tasks.map((task) =>
                task.id === taskId ? { ...task, ...newTaskData } : task
              ),
            }
          : subject
      )
    );
  };

  const deleteTask = (slug, taskId) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.slug === slug
          ? {
              ...subject,
              tasks: subject.tasks.filter((task) => task.id !== taskId),
            }
          : subject
      )
    );
  };

  const reorderTasks = (slug, newTasks) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.slug === slug ? { ...subject, tasks: newTasks } : subject
      )
    );
  };

  return (
    <SubjectsTopicsContext.Provider
      value={{ subjects, addTask, editTask, deleteTask, reorderTasks }}
    >
      {children}
    </SubjectsTopicsContext.Provider>
  );
};

export const useSubjectsTopics = () => useContext(SubjectsTopicsContext);

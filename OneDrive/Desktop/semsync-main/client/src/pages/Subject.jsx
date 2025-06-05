import React, { useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSubjects } from "../context/SubjectContext";
import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "../components/TaskItem";
import SubjectListBar from "../components/SubjectListBar";
import './Subject.css';

const Subject = () => {
  const { subjectSlug } = useParams();
  const { subjects, addTask, editTask, deleteTask, reorderTasks, getSubjectProgress } = useSubjects();
  const subject = subjects.find((s) => s.slug === subjectSlug);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [dropIndicator, setDropIndicator] = useState(null);
  const containerRef = useRef(null);

  const progress = getSubjectProgress(subjectSlug);

  if (!subject) return <p className="subject-not-found">Subject not found.</p>;

  const handleAddTask = useCallback(() => {
    if (!newTaskTitle.trim()) return;
    addTask(subjectSlug, {
      id: `${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
    });
    setNewTaskTitle("");
  }, [newTaskTitle, subjectSlug, addTask]);

  const saveEdit = useCallback(() => {
    if (!editingTaskTitle.trim()) return;
    editTask(subjectSlug, editingTaskId, { title: editingTaskTitle });
    setEditingTaskId(null);
    setEditingTaskTitle("");
  }, [editingTaskTitle, subjectSlug, editingTaskId, editTask]);

  const handleDragStart = useCallback((task, e) => {
    setDraggedTask(task);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!draggedTask || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - containerRect.top;
    
    const isDeleteZone = y > containerRect.height - 40;
    setShowDeleteZone(isDeleteZone);
    
    if (isDeleteZone) {
      setDropIndicator(null);
      return;
    }

    const taskElements = Array.from(containerRef.current.querySelectorAll('.task-item:not(.dragging)'));
    const closestTask = taskElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY });

    setDropIndicator(closestTask.element?.id || null);
  }, [draggedTask]);

  const handleDragEnd = useCallback((e) => {
    if (!draggedTask || !containerRef.current) {
      setDraggedTask(null);
      setShowDeleteZone(false);
      setDropIndicator(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - containerRect.top;

    if (y > containerRect.height - 40) {
      deleteTask(subjectSlug, draggedTask.id);
    }

    setDraggedTask(null);
    setShowDeleteZone(false);
    setDropIndicator(null);
  }, [draggedTask, subjectSlug, deleteTask]);

  return (
    <div className="subject-container">
      <SubjectListBar />
      <div className="subject-header">
        <h1 className="subject-title">{subject.title}</h1>
        <div className="subject-progress-container">
          <span className="subject-progress-text">Progress: {progress}%</span>
          <div className="subject-progress-bar-container">
            <div className="subject-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="subject-actions">
        <motion.input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add new task"
          className="subject-input"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          aria-label="Add new task input"
        />
        <motion.button
          onClick={handleAddTask}
          className="subject-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add task"
        >
          Add Task
        </motion.button>
      </div>

      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        className="subject-tasks-container"
      >
        <AnimatePresence>
          {subject.tasks.map((task) => (
            <React.Fragment key={task.id}>
              {dropIndicator === `task-${task.id}` && (
                <motion.div
                  className="subject-tasks-divider"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <TaskItem
                task={task}
                isEditing={editingTaskId === task.id}
                editingTaskTitle={editingTaskTitle}
                setEditingTaskTitle={setEditingTaskTitle}
                saveEdit={saveEdit}
                cancelEdit={() => {
                  setEditingTaskId(null);
                  setEditingTaskTitle("");
                }}
                onEdit={() => {
                  setEditingTaskId(task.id);
                  setEditingTaskTitle(task.title);
                }}
                onDelete={() => deleteTask(subjectSlug, task.id)}
                onToggleComplete={() => editTask(subjectSlug, task.id, { completed: !task.completed })}
                onDragStart={handleDragStart}
                isDragging={draggedTask?.id === task.id}
              />
            </React.Fragment>
          ))}
        </AnimatePresence>

        {subject.tasks.length === 0 && (
          <div className="subject-empty-state">
            <p className="subject-empty-text">No tasks yet</p>
            <p className="subject-empty-subtext">Add your first task above</p>
          </div>
        )}
      </div>

      {showDeleteZone && (
        <motion.div
          className="subject-notification"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          <span className="subject-notification-icon">🗑️</span>
          <span>Drop here to delete</span>
        </motion.div>
      )}
    </div>
  );
};

export default Subject;
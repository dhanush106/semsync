import React from "react";
import { motion } from "framer-motion";
import './TaskItem.css';

const TaskItem = ({
  task,
  isEditing,
  editingTaskTitle,
  setEditingTaskTitle,
  saveEdit,
  cancelEdit,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  isDragging,
}) => {
  return (
    <motion.div
      id={`task-${task.id}`}
      draggable
      onDragStart={(e) => onDragStart(task, e)}
      className={`task-item ${isDragging ? 'task-item-dragging' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isDragging ? 1.05 : 1,
        boxShadow: isDragging
          ? "16px 16px 32px rgba(0, 0, 0, 0.2), -16px -16px 32px rgba(255, 255, 255, 0.7)"
          : task.completed
            ? "8px 8px 16px rgba(0, 0, 0, 0.1), -4px -4px 16px rgba(255, 255, 255, 0.5)"
            : "12px 12px 24px rgba(0, 0, 0, 0.1), -12px -12px 24px rgba(255, 255, 255, 0.7)",
      }}
      exit={{ opacity: 0, x: 100 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        scale: { type: "spring", damping: 15, stiffness: 500 },
      }}
      layout
    >
      {isEditing ? (
        <div className="task-item-header">
          <input
            value={editingTaskTitle}
            onChange={(e) => setEditingTaskTitle(e.target.value)}
            autoFocus
            className="task-item-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            aria-label="Edit task input"
          />
          <div className="task-item-actions">
            <motion.button
              onClick={saveEdit}
              className="task-item-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Save edit"
            >
              Save
            </motion.button>
            <motion.button
              onClick={cancelEdit}
              className="task-item-button-secondary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Cancel edit"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="task-item-footer">
          <div
            onClick={onToggleComplete}
            className={`task-item-title ${task.completed ? 'task-item-completed' : ''}`}
            aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onToggleComplete()}
          >
            {task.title}
          </div>
          <div className="task-item-meta">
            <span className="task-item-date">{task.dueDate}</span>
            <span className="task-item-priority">{task.priority}</span>
          </div>
          <div className="task-item-actions">
            <motion.button
              onClick={onEdit}
              className="task-item-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Edit task"
            >
              Edit
            </motion.button>
            <motion.button
              onClick={onDelete}
              className="task-item-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Delete task"
            >
              Delete
            </motion.button>
          </div>
        </div>
      )}

      <div className={`task-item-priority-indicator ${getPriorityColor(task.priority)}`}></div>
    </motion.div>
  );
};

export default TaskItem;
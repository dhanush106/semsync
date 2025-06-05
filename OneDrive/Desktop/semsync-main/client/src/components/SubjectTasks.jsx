import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSubjects } from "../context/SubjectContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import './SubjectTasks.css';

const statuses = ["To Do", "In Progress", "Completed"];

const SubjectTasks = () => {
  const { subjectSlug } = useParams();
  const {
    subjects,
    addTask,
    editTask,
    deleteTask,
    reorderTasks,
  } = useSubjects();

  const subject = subjects.find((s) => s.slug === subjectSlug);

  // Local state for editing / adding
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  if (!subject) return <p>Subject not found</p>;

  // Group tasks by status
  const tasksByStatus = {};
  statuses.forEach((status) => {
    tasksByStatus[status] = subject.tasks.filter((t) => t.status === status);
  });

  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in same column and same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Clone tasks array
    let newTasks = Array.from(subject.tasks);

    // Find the dragged task
    const draggedTaskIndex = newTasks.findIndex((t) => t.id === draggableId);
    const draggedTask = newTasks[draggedTaskIndex];

    // Remove dragged task
    newTasks.splice(draggedTaskIndex, 1);

    // Update status of dragged task to destination droppableId
    draggedTask.status = destination.droppableId;

    // Calculate new index for insertion based on tasks in destination
    const tasksInDest = newTasks.filter((t) => t.status === destination.droppableId);

    // Find global insert index in newTasks array
    // Place dragged task before the task at destination.index in tasksInDest
    if (destination.index === tasksInDest.length) {
      // Append to end
      newTasks.push(draggedTask);
    } else {
      // Find the actual index in newTasks for insertion
      const beforeTaskId = tasksInDest[destination.index].id;
      const insertIndex = newTasks.findIndex((t) => t.id === beforeTaskId);
      newTasks.splice(insertIndex, 0, draggedTask);
    }

    reorderTasks(subjectSlug, newTasks);
  };

  // Add new task helper
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask(subjectSlug, {
      id: `${Date.now()}`, // simple unique id, replace with uuid if you want
      title: newTaskTitle.trim(),
      status: "To Do",
      completed: false,
    });
    setNewTaskTitle("");
  };

  // Edit task title save
  const saveEdit = () => {
    if (!editingTaskTitle.trim()) return;

    editTask(subjectSlug, editingTaskId, { title: editingTaskTitle });
    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  // Toggle completed
  const toggleComplete = (task) => {
    editTask(subjectSlug, task.id, { completed: !task.completed });
  };

  return (
    <div className="subject-tasks-container">
      <h1 className="subject-tasks-title">{subject.title} - Tasks</h1>

      <div className="subject-tasks-list">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`subject-tasks-column ${status === 'completed' ? 'subject-tasks-column-completed' : ''}`}
                >
                  <h2 className="subject-tasks-column-title">{status}</h2>

                  <AnimatePresence>
                    {tasksByStatus[status].map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`subject-tasks-item ${task.completed ? 'subject-tasks-item-completed' : ''}`}
                            onDoubleClick={() => {
                              setEditingTaskId(task.id);
                              setEditingTaskTitle(task.title);
                            }}
                          >
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={editingTaskTitle}
                                onChange={(e) =>
                                  setEditingTaskTitle(e.target.value)
                                }
                                onBlur={saveEdit}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit();
                                  if (e.key === "Escape") {
                                    setEditingTaskId(null);
                                    setEditingTaskTitle("");
                                  }
                                }}
                                autoFocus
                                className="subject-tasks-input"
                              />
                            ) : (
                              <div className="subject-tasks-item-header">
                                <span className={`subject-tasks-priority ${getPriorityColor(task.priority)}`}>{task.title}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleComplete(task);
                                  }}
                                  className={`ml-2 rounded px-2 py-1 text-xs font-semibold
                                  ${
                                    task.completed
                                      ? "bg-red-300 text-red-900"
                                      : "bg-green-300 text-green-900"
                                  }
                                  hover:brightness-90 transition`}
                                >
                                  {task.completed ? "Undo" : "Done"}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(subjectSlug, task.id);
                                  }}
                                  className="subject-tasks-delete-button"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}

                  {status === "To Do" && (
                    <div className="subject-tasks-add-section">
                      <input
                        type="text"
                        placeholder="New task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTask();
                        }}
                        className="subject-tasks-add-input"
                      />
                      <button
                        onClick={handleAddTask}
                        className="subject-tasks-add-button"
                      >
                        Add Task
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default SubjectTasks;

// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SubjectProvider } from "./context/SubjectContext";

import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Subject from "./pages/Subject";
import Quiz from "./pages/Quiz";
import DailyTracker from "./pages/DailyTracker";
import Ranking from "./pages/Ranking";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:subjectSlug" element={<Subject />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/daily-tracker" element={<DailyTracker />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Layout>
  );
}

export default App;

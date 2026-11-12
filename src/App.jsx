import { useState, useEffect } from 'react';

import Header from './components/header.jsx';
import Sidebar from './components/sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from './services/api.js';

import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  async function loadStudents() {
    try {
      setLoading(true);
      setError('');
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleSaveStudent(studentData) {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, studentData);
        setEditingStudent(null);
      } else {
        await createStudent(studentData);
      }
      await loadStudents();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  function handleEditStudent(student) {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeleteStudent(id) {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await deleteStudent(id);
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="main-content">
          <Dashboard
            students={students}
            loading={loading}
            error={error}
            editingStudent={editingStudent}
            onSave={handleSaveStudent}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onCancelEdit={() => setEditingStudent(null)}
            onRetry={loadStudents}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react'

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from './services/api';

import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  // Load students from backend
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

  // Add or update student
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
      throw err;
    }
  }

  // Edit student
  function handleEditStudent(student) {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delete student
  async function handleDeleteStudent(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmed) return;

    try {
      await deleteStudent(id);
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCancelEdit() {
    setEditingStudent(null);
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
            onCancelEdit={handleCancelEdit}
            onRetry={loadStudents}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
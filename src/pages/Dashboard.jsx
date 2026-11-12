
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';

function Dashboard({
  students,
  loading,
  error,
  editingStudent,
  onSave,
  onEdit,
  onDelete,
  onCancelEdit,
  onRetry
}) {
  return (
    <div className="dashboard" id="dashboard">

      <div className="welcome-section">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here is your student overview.</p>
        </div>

        <span className="today-label">
          Student Portal
        </span>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">♙</div>
          <div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">▤</div>
          <div>
            <p>Student Records</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <p>System Status</p>
            <h2>{error ? 'Error' : loading ? 'Loading' : 'Ready'}</h2>
          </div>
        </div>
      </section>

      <section id="add-student">
        <StudentForm
          onSubmit={onSave}
          editingStudent={editingStudent}
          onCancel={onCancelEdit}
        />
      </section>

      <section id="students">
        <StudentTable
          students={students}
          loading={loading}
          error={error}
          onEdit={onEdit}
          onDelete={onDelete}
          onRetry={onRetry}
        />
      </section>

    </div>
  );
}

export default Dashboard;

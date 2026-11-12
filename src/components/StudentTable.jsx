
import { useState } from 'react';

function StudentTable({
  students,
  loading,
  error,
  onEdit,
  onDelete,
  onRetry
}) {
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(student => {
    const searchText = search.toLowerCase();

    return (
      (student.name || '').toLowerCase().includes(searchText) ||
      (student.email || '').toLowerCase().includes(searchText) ||
      (student.course || '').toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="panel student-table-panel">

      <div className="panel-heading table-heading">
        <div>
          <h2>Student List</h2>
          <p>View and manage all student records.</p>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="table-message">Loading students...</p>
      ) : error ? (
        <div className="table-message">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={onRetry}>
            Try Again
          </button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <p className="table-message">
          No students found.
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>

                  <td className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-delete"
                      onClick={() => onDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default StudentTable;

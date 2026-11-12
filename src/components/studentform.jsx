
import { useEffect, useState } from 'react';

function StudentForm({
  onSubmit,
  editingStudent,
  onCancel
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        course: editingStudent.course || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: ''
      });
    }

    setError('');
  }, [editingStudent]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.course.trim()
    ) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSaving(true);
      await onSubmit(formData);

      if (!editingStudent) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to save student.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel student-form-panel">
      <div className="panel-heading">
        <div>
          <h2>
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h2>
          <p>Enter the student information below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter student name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              name="course"
              placeholder="Enter course"
              value={formData.course}
              onChange={handleChange}
            />
          </div>

        </div>

        {error && (
          <p className="form-error">{error}</p>
        )}

        <div className="form-buttons">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : editingStudent
                ? 'Update Student'
                : 'Add Student'}
          </button>

          {editingStudent && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default StudentForm;

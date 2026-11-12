
const API_URL = 'https://student-management-system01.dockhosting.cloud/api/students';

async function request(path = '', options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers
      }
    });
  } catch {
    throw new Error(
      'Cannot connect to backend. Please start Spring Boot.'
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

export function getStudents() {
  return request();
}

export function createStudent(student) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(student)
  });
}

export function updateStudent(id, student) {
  return request(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(student)
  });
}

export function deleteStudent(id) {
  return request(`/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}

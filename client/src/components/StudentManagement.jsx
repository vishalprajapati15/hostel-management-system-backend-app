import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [completedStudents, setCompletedStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    roll_number: '',
    contact_number: '',
    email: ''
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'completed'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCompletedStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCompletedStudents = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/students/completed');
        setCompletedStudents(response.data);
    } catch (error) {
        console.error('Error fetching completed students:', error);
        setError('Failed to fetch completed students');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students', newStudent);
      setNewStudent({ name: '', roll_number: '', contact_number: '', email: '' });
      fetchStudents();
      fetchCompletedStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student');
    }
    setLoading(false);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
        return;
    }

    setLoading(true);
    try {
        await axios.delete(`http://localhost:5000/api/students/${studentId}`);
        fetchStudents();
        fetchCompletedStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
        if (error.response?.data?.error) {
            alert(error.response.data.error);
        } else {
            setError('Failed to delete student');
        }
    }
    setLoading(false);
};

  return (
    <div className="container">
      <h2>Student Management</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={newStudent.roll_number}
          onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={newStudent.contact_number}
          onChange={(e) => setNewStudent({ ...newStudent, contact_number: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Student'}
        </button>
        <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Students
                </button>
                <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed Students
                </button>
            </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Contact</th>
            <th>Email</th>
            {activeTab === 'completed' && <th>Last Checkout</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {(activeTab === 'all' ? students : completedStudents).map((student) => (
                        <tr key={student.student_id}>
                            <td>{student.name}</td>
                            <td>{student.roll_number}</td>
                            <td>{student.contact_number}</td>
                            <td>{student.email}</td>
                            {activeTab === 'completed' && (
                                <td>
                                    {student.last_checkout ? 
                                        new Date(student.last_checkout).toLocaleDateString() : 
                                        'Never allocated'}
                                </td>
                            )}
                            <td>
                                {activeTab === 'completed' && (
                                    <button
                                        onClick={() => handleDelete(student.student_id)}
                                        className="delete-btn"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentManagement;
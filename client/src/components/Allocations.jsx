
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [newAllocation, setNewAllocation] = useState({
    room_id: '',
    student_id: '',
    check_in_date: ''
  });

  useEffect(() => {
    fetchAllocations();
    fetchRooms();
    fetchStudents();
  }, []);

  const fetchAllocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/allocations');
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data.filter(room => room.status === 'Available'));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/allocations', newAllocation);
      setNewAllocation({ room_id: '', student_id: '', check_in_date: '' });
      fetchAllocations();
      fetchRooms();
    } catch (error) {
      console.error('Error allocating room:', error);
    }
  };

  const handleDeallocate = async (allocationId) => {
    try {
      await axios.put(`http://localhost:5000/api/allocations/${allocationId}`, {
        check_out_date: new Date().toISOString().split('T')[0]
      });
      fetchAllocations();
      fetchRooms();
    } catch (error) {
      console.error('Error deallocating room:', error);
    }
  };

  return (
    <div className="container">
      <h2>Room Allocations</h2>
      <form onSubmit={handleAllocate} className="form">
        <select
          value={newAllocation.room_id}
          onChange={(e) => setNewAllocation({ ...newAllocation, room_id: e.target.value })}
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.room_id} value={room.room_id}>
              Room {room.room_number} ({room.room_type})
            </option>
          ))}
        </select>
        <select
          value={newAllocation.student_id}
          onChange={(e) => setNewAllocation({ ...newAllocation, student_id: e.target.value })}
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.student_id} value={student.student_id}>
              {student.name} ({student.roll_number})
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newAllocation.check_in_date}
          onChange={(e) => setNewAllocation({ ...newAllocation, check_in_date: e.target.value })}
        />
        <button type="submit">Allocate Room</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Student Name</th>
            <th>Check In Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation) => (
            <tr key={allocation.allocation_id}>
              <td>{allocation.room_number}</td>
              <td>{allocation.name}</td>
              <td>{new Date(allocation.check_in_date).toLocaleDateString()}</td>
              <td>{allocation.status}</td>
              <td>
                {allocation.status === 'Active' && (
                  <button
                    onClick={() => handleDeallocate(allocation.allocation_id)}
                    className="deallocate-btn"
                  >
                    Deallocate
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

export default Allocations;
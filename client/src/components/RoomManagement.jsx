
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_type: 'Single',
    floor_number: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/rooms', newRoom);
      setNewRoom({ room_number: '', room_type: 'Single', floor_number: '' });
      fetchRooms();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  return (
    <div className="container">
      <h2>Room Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Room Number"
          value={newRoom.room_number}
          onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
        />
        <select
          value={newRoom.room_type}
          onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
        >
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Triple">Triple</option>
        </select>
        <input
          type="number"
          placeholder="Floor Number"
          value={newRoom.floor_number}
          onChange={(e) => setNewRoom({ ...newRoom, floor_number: e.target.value })}
        />
        <button type="submit">Add Room</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Type</th>
            <th>Floor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room_id}>
              <td>{room.room_number}</td>
              <td>{room.room_type}</td>
              <td>{room.floor_number}</td>
              <td>{room.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomManagement;

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'hostel_management'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes

// Get all rooms
app.get('/api/rooms', (req, res) => {
    const query = 'SELECT * FROM rooms';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add new room
app.post('/api/rooms', (req, res) => {
    const { room_number, room_type, floor_number } = req.body;
    const query = 'INSERT INTO rooms (room_number, room_type, floor_number) VALUES (?, ?, ?)';
    db.query(query, [room_number, room_type, floor_number], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Room added successfully', id: results.insertId });
    });
});

// Get all students
app.get('/api/students', (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add new student
app.post('/api/students', (req, res) => {
    const { name, roll_number, contact_number, email } = req.body;
    const query = 'INSERT INTO students (name, roll_number, contact_number, email) VALUES (?, ?, ?, ?)';
    db.query(query, [name, roll_number, contact_number, email], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Student added successfully', id: results.insertId });
    });
});

// Allocate room
app.post('/api/allocations', (req, res) => {
    const { room_id, student_id, check_in_date } = req.body;
    const queries = [
        'INSERT INTO allocations (room_id, student_id, check_in_date) VALUES (?, ?, ?)',
        'UPDATE rooms SET status = "Occupied" WHERE room_id = ?'
    ];
    
    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        db.query(queries[0], [room_id, student_id, check_in_date], (err, results) => {
            if (err) {
                db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
                return;
            }

            db.query(queries[1], [room_id], (err, results) => {
                if (err) {
                    db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                    return;
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                        return;
                    }
                    res.json({ message: 'Room allocated successfully' });
                });
            });
        });
    });
});

// Deallocate room
app.put('/api/allocations/:id', (req, res) => {
    const { id } = req.params;
    const { check_out_date } = req.body;
    const queries = [
        'UPDATE allocations SET status = "Completed", check_out_date = ? WHERE allocation_id = ?',
        'UPDATE rooms SET status = "Available" WHERE room_id = (SELECT room_id FROM allocations WHERE allocation_id = ?)'
    ];

    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        db.query(queries[0], [check_out_date, id], (err, results) => {
            if (err) {
                db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
                return;
            }

            db.query(queries[1], [id], (err, results) => {
                if (err) {
                    db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                    return;
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                        return;
                    }
                    res.json({ message: 'Room deallocated successfully' });
                });
            });
        });
    });
});

// Get allocations with room and student details
app.get('/api/allocations', (req, res) => {
    const query = `
        SELECT a.*, r.room_number, r.room_type, s.name, s.roll_number 
        FROM allocations a 
        JOIN rooms r ON a.room_id = r.room_id 
        JOIN students s ON a.student_id = s.student_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
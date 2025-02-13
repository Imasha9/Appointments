import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments');
      console.log('Appointments:', response.data); // Log to check if data is being fetched correctly
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        All Appointments (Admin)
      </h2>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650, border: '1px solid #ddd' }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd' }}>User ID</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd' }}>Contact</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd' }}>Date</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd' }}>Time Slot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell style={{ border: '1px solid #ddd' }}>{appointment.user_id}</TableCell>
                  <TableCell style={{ border: '1px solid #ddd' }}>{appointment.name}</TableCell>
                  <TableCell style={{ border: '1px solid #ddd' }}>{appointment.contact}</TableCell>
                  <TableCell style={{ border: '1px solid #ddd' }}>{appointment.date}</TableCell>
                  <TableCell style={{ border: '1px solid #ddd' }}>{appointment.time_slot}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminAppointments;

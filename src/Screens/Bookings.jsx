import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore } from 'date-fns';
import './Booking.css';

const patients = [
  "John Doe", "Jane Smith", "Alex Johnson", "Emily Davis", "Michael Lee",
  "Sarah Wilson", "David Kim", "Olivia Brown", "Daniel Garcia", "Sophia Miller"
];

const doctors = [
  "Dr. Smith", "Dr. Johnson", "Dr. Patel", "Dr. Gupta", "Dr. Lee"
];

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  

  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [time, setTime] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   console.log(selectedDate);


  // Watch query param change and update selectedDate
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);

      const stored = JSON.parse(localStorage.getItem('appointments')) || [];
      const filtered = stored
        .filter(appt => appt.date === dateParam)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAppointments(filtered);
    }
  }, [location.search]);

  useEffect(() => {
    const mode = localStorage.getItem('darkMode');
    setDarkMode(mode === 'true');
  }, []);

  const handleAdd = () => {
    if (!patient || !doctor || !time) {
      alert('Please fill all fields');
      return;
    }

    const [hour] = time.split(':').map(Number);
    if (hour < 10 || hour >= 18) {
      alert('Appointments can only be scheduled between 10:00 AM and 6:00 PM');
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${time}`);
    if (format(now, 'yyyy-MM-dd') === selectedDate && isBefore(selectedDateTime, now)) {
      alert('Cannot book an appointment in the past.');
      return;
    }

    const stored = JSON.parse(localStorage.getItem('appointments')) || [];
    const duplicate = stored.some(
      appt => appt.date === selectedDate && appt.time === time && appt.doctor === doctor
    );

    if (duplicate) {
      alert(`This time slot is already booked with ${doctor}`);
      return;
    }

    const newAppointment = {
      id: Date.now(),
      date: selectedDate,
      patient,
      doctor,
      time,
      createdAt: new Date().toISOString()
    };

    const updated = [newAppointment, ...stored];
    localStorage.setItem('appointments', JSON.stringify(updated));
    setAppointments(prev => [newAppointment, ...prev]);

    setShowAddForm(false);
    setPatient('');
    setDoctor('');
    setTime('');
  };

  const handleDelete = (id) => {
    const updated = appointments.filter(appt => appt.id !== id);
    setAppointments(updated);

    const allStored = JSON.parse(localStorage.getItem('appointments')) || [];
    const filteredStored = allStored.filter(appt => appt.id !== id);
    localStorage.setItem('appointments', JSON.stringify(filteredStored));
  };

  const filteredAppointments = filterDoctor
    ? appointments.filter(appt => appt.doctor === filterDoctor)
    : appointments;

  return (
    <div className={`booking-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="booking-header">
        <button className="back-button" onClick={() => navigate('/Calender')}>
          Back
        </button>

        <h2 style={{ color: darkMode ? '#fff' : '#000' }}>
          {selectedDate ? format(parseISO(selectedDate), 'dd-MM-yyyy') : 'Select a date'}
        </h2>

        <button className="add-button" onClick={() => setShowAddForm(true)}>
          Add
        </button>
      </div>

      <div className="filter-bar">
        <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}>
          <option value="">Filter by Doctor</option>
          {doctors.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Appointment</h3>

            <select value={patient} onChange={e => setPatient(e.target.value)}>
              <option value="">Select Patient</option>
              {patients.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>

            <select value={doctor} onChange={e => setDoctor(e.target.value)}>
              <option value="">Select Doctor</option>
              {doctors.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>

            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              min="10:00"
              max="18:00"
            />

            <div className="modal-buttons">
              <button onClick={handleAdd}>Book</button>
              <button onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="appointment-list">
        {filteredAppointments.length === 0 ? (
          <p className="no-appointments">No appointments booked for this date.</p>
        ) : (
          filteredAppointments.map(appt => (
            <div className="appointment-card" key={appt.id}>
              <span style={{ color: darkMode ? '#fff' : '#000' }}>
                <strong>{appt.time}</strong> — {appt.patient} with {appt.doctor}
              </span>
              <button className="delete-button" onClick={() => handleDelete(appt.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;

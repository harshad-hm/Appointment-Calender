// src/Screens/Calender.jsx
import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isAfter,
} from 'date-fns';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Switch,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LeftArrow from '../assets/LeftArrow.png';
import RightArrow from '../assets/RightArrow.png';
import './calender.css';
import { useNavigate } from 'react-router-dom';

const Calender = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleLogout = () => {
    alert('Logged out!');
    navigate('/');
  };

  const renderHeader = () => (
    <Box className="calendar-header-bar">
      <Button onClick={handlePrevMonth}>
        <img src={LeftArrow} alt="Previous Month" className="arrow-icon" />
      </Button>
      <Typography variant="h5" color={darkMode ? '#fff' : '#000'}>
        {format(currentMonth, 'MMMM yyyy')}
      </Typography>
      <Button onClick={handleNextMonth}>
        <img src={RightArrow} alt="Next Month" className="arrow-icon" />
      </Button>
    </Box>
  );

  const renderDays = () =>
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
      <Box
        key={day}
        className="calendar-day-header"
        style={{
          backgroundColor: darkMode ? '#333' : '#90e0ef',
          color: darkMode ? '#fff' : '#000',
        }}
      >
        <Typography variant="subtitle2" style={{ fontSize: 20 }}>
          {day}
        </Typography>
      </Box>
    ));

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const allDays = [];
    let day = startDate;

    while (day <= endDate) {
      const currentDay = day; // freeze day value

      const isCurrentMonth = isSameMonth(currentDay, monthStart);
      const isToday = isSameDay(currentDay, today);
      const isFuture = isAfter(currentDay, today) || isToday;
      const isBookable = isCurrentMonth && isFuture;

      const cell = (
        <Box
          key={currentDay.toISOString()}
          className={`calendar-day 
            ${!isCurrentMonth ? 'faded' : ''} 
            ${isToday ? 'today' : ''} 
            ${isBookable ? 'clickable' : 'disabled'} 
            ${darkMode ? 'dark' : 'light'}`}
          onClick={() => {
            if (isBookable) {
              const selectedDate = format(currentDay, 'yyyy-MM-dd');
              navigate(`/Bookings?date=${selectedDate}`);
            }
          }}
          sx={{
            margin: isMobile ? '10px 0' : '0',
            padding: isMobile ? '24px' : 'auto',
            textAlign: 'center',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            boxShadow: isMobile ? '0px 2px 4px rgba(0,0,0,0.1)' : 'none',
            '&:hover': darkMode
              ? {
                  border: '2px solid white',
                  boxShadow: '0px 0px 10px white',
                }
              : {},
          }}
        >
          <Typography variant="body2" style={{ fontSize: 25 }}>
            {format(currentDay, 'd')}
          </Typography>
        </Box>
      );

      allDays.push(cell);
      day = addDays(day, 1); // advance day
    }

    if (isMobile) {
      return (
        <Box sx={{ overflowY: 'scroll', maxHeight: '65vh' }}>
          {allDays.map((d, idx) => (
            <Grid container key={idx} className="calendar-row">
              {d}
            </Grid>
          ))}
        </Box>
      );
    } else {
      const rows = [];
      let week = [];

      allDays.forEach((d, i) => {
        week.push(d);
        if ((i + 1) % 7 === 0) {
          rows.push(
            <Grid container key={i} className="calendar-row">
              {week}
            </Grid>
          );
          week = [];
        }
      });

      return <>{rows}</>;
    }
  };

  return (
    <div className={`calendar-screen ${darkMode ? 'dark-mode' : ''}`}>
      <Box
        className="navbar"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: darkMode ? '#222' : '#FAF7F3',
          maxHeight: '80px',
        }}
      >
        <Typography variant="h6" color={darkMode ? '#fff' : '#000'}>
          Appointment Calendar
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              color="default"
            />
            <Typography
              variant="body2"
              style={{ color: darkMode ? '#fff' : '#000' }}
            >
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <div className="calendar-container-Main">
        <Paper className="calendar-container">
          {renderHeader()}

          {isMobile && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: '6px',
                  fontWeight: 'bold',
                  color: darkMode ? '#fff' : '#000',
                }}
              >
                Choose a date
              </Typography>
              <input
                type="date"
                onChange={(e) => {
                  if (e.target.value) {
                    const selected = new Date(e.target.value);
                    const selectedDate = format(selected, 'yyyy-MM-dd');
                    navigate(`/Bookings?date=${selectedDate}`);
                  }
                }}
                style={{
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px',
                  width: '100%',
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000',
                }}
              />
            </Box>
          )}

          {!isMobile && <Grid container className="calendar-header">{renderDays()}</Grid>}
          {renderCells()}
        </Paper>
      </div>
    </div>
  );
};

export default Calender;

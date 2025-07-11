import { useState } from 'react'
import Landing from './Screens/Landing'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Calender from './Screens/Calender'
import Bookings from './Screens/Bookings'


function App() {
  

  return (
    <BrowserRouter  basename="/Appointment-Calender" >
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="Calender" element={<Calender/>} />
      <Route path="Bookings" element={<Bookings/>} />
    </Routes>
    </BrowserRouter>

  )
}

export default App

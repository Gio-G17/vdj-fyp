import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/bookingFormModal.css"


const BookingFormModal = ({ open, handleClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    room: "",
    dj: "",
    date: dayjs(),
    time: null,
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const [djList, setDjList] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);


  useEffect(() => {
    const fetchDJsAndSlots = async () => {
      try {
        // 1. Get all DJs
        const res = await axios.get("http://localhost:5001/api/users/djs");
        setDjList(res.data);
  
        // 2. If a DJ is already selected, get their unavailable slots
        if (formData.dj) {
          const slotRes = await axios.get(`http://localhost:5001/api/bookings/unavailable/${formData.dj}`);
          setUnavailableSlots(slotRes.data);
        } else {
          setUnavailableSlots([]);
        }
  
      } catch (err) {
        console.error("Failed to fetch DJs or unavailable slots:", err);
      }
    };
  
    fetchDJsAndSlots();
  }, [formData.dj]); // ✅ Re-run when DJ selection changes
  

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDateChange = (value) => {
    setFormData({ ...formData, date: value });
  };

  const handleTimeChange = (value) => {
    setFormData({ ...formData, time: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/bookings", {
        ...formData,
        date: dayjs(formData.date).format("YYYY-MM-DD"),
        time: dayjs(formData.time).format("HH:mm")
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      handleClose();
      onBookingSuccess();
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New Booking</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Room</InputLabel>
          <Select value={formData.room} label="Room" onChange={handleChange("room")}>
            <MenuItem value="Techno Room">Techno Room</MenuItem>
            <MenuItem value="Commercial Room">Commercial Room</MenuItem>
            <MenuItem value="House Room">House Room</MenuItem>
            <MenuItem value="R&B Room">R&B Room</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>DJ</InputLabel>
          <Select value={formData.dj} label="DJ" onChange={handleChange("dj")}>
            {djList.map((dj) => (
              <MenuItem key={dj._id} value={dj._id}>
                {dj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            selected={formData.date ? new Date(formData.date) : null}
            onChange={(date) => setFormData({ ...formData, date })}
            minDate={new Date()}
            filterDate={(date) => {
              const formatted = dayjs(date).format("YYYY-MM-DD");
              return !unavailableSlots.some(slot => slot.date === formatted);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className="MuiInputBase-input MuiOutlinedInput-input"
          />
          <TimePicker
            label="Time"
            value={formData.time}
            onChange={handleTimeChange}
            minTime={
              formData.date && dayjs().isSame(formData.date, "day") ? dayjs() : null
            }
            shouldDisableTime={(timeValue, clockType) => {
              if (clockType !== "minutes" || !formData.date) return false;
              const selectedDate = dayjs(formData.date).format("YYYY-MM-DD");
              const formattedTime = dayjs(timeValue, "HH:mm").format("HH:mm");

              return unavailableSlots.some(slot =>
                slot.date === selectedDate && slot.time === formattedTime
              );
            }}
            sx={{ width: "100%", marginTop: "16px" }}
          />

          {/* <DatePicker
            label="Date"
            value={formData.date}
            onChange={handleDateChange}
            sx={{ width: "100%", marginTop: "16px" }}
          />
          <TimePicker
            label="Time"
            value={formData.time}
            onChange={handleTimeChange}
            sx={{ width: "100%", marginTop: "16px" }}
          /> */}
        </LocalizationProvider>

        <TextField fullWidth margin="dense" label="Name" value={formData.name} onChange={handleChange("name")} />
        <TextField fullWidth margin="dense" label="Email" value={formData.email} onChange={handleChange("email")} />
        <TextField fullWidth margin="dense" label="Phone Number" value={formData.phone} onChange={handleChange("phone")} />
        <TextField fullWidth margin="dense" label="Notes" multiline rows={3} value={formData.notes} onChange={handleChange("notes")} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Book</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingFormModal;

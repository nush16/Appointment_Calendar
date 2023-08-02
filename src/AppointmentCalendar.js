import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Modal from "react-modal";
import { Button, Modal as MuiModal, TextField } from "@mui/material";
import { Box } from "@mui/system";

const localizer = momentLocalizer(moment);

const initialAppointments = [
  {
    id: 1,
    title: "Meeting 1",
    start: new Date(2023, 7, 2, 10, 0),
    end: new Date(2023, 7, 2, 12, 0),
    patient: "John Doe",
    doctor: "Dr. Smith",
    notes: "Routine checkup",
  },
  {
    id: 2,
    title: "Meeting 2",
    start: new Date(2023, 7, 3, 14, 0),
    end: new Date(2023, 7, 3, 16, 0),
    patient: "Jane Smith",
    doctor: "Dr. Johnson",
    notes: "Follow-up appointment",
  },
  // Add more appointments as needed
];

const AppointmentEvent = ({ event }) => (
  <span>
    <strong>{event.title}</strong>
    <br />
    <em>{event.patient}</em>
  </span>
);

const AppointmentCalendar = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState(null);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [calendarKey, setCalendarKey] = useState(0); // Add a state for the Calendar key

  const handleCellClick = (event) => {
    setSelectedAppointment(event);
    setEditedAppointment({ ...event });
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setEditedAppointment(null);
  };

  const handleSubmit = () => {
    setAppointments((prevAppointments) => {
      const updatedAppointments = prevAppointments.map((appointment) =>
        appointment.id === editedAppointment.id
          ? editedAppointment
          : appointment
      );
      return updatedAppointments;
    });
    handleCloseModal();
  };

  const handleFormChange = (field, value) => {
    setEditedAppointment((prevAppointment) => ({
      ...prevAppointment,
      [field]: value,
    }));
  };

  // Use useEffect to re-render the calendar when appointments are updated
  useEffect(() => {
    setCalendarKey((prevKey) => prevKey + 1);
  }, [appointments]);

  return (
    <div>
      <h1>Appointment Calendar</h1>
      <Calendar
        key={calendarKey} // Add the key prop to re-render the calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }} // Adjust height as per your requirement
        views={["day", "week", "month"]} // Set the views directly
        defaultView="week" // Set the default view to 'week'
        min={new Date(2023, 7, 2, 8, 0)} // Set the minimum time to 8am
        max={new Date(2023, 7, 2, 17, 0)} // Set the maximum time to 5pm
        onSelectEvent={handleCellClick} // Handle cell click event
        components={{
          event: AppointmentEvent,
        }}
      />

      {/* Modal to display appointment details */}
      <MuiModal
        open={selectedAppointment !== null}
        onClose={handleCloseModal}
        aria-labelledby="appointment-details-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "white",
            p: 3,
            borderRadius: 4,
          }}
        >
          <h2 id="appointment-details-title">Appointment Details</h2>
          {editedAppointment && (
            <div>
              <TextField
                label="Patient"
                value={editedAppointment.patient}
                fullWidth
                onChange={(e) => handleFormChange("patient", e.target.value)}
              />
              <TextField
                label="Doctor"
                value={editedAppointment.doctor}
                fullWidth
                onChange={(e) => handleFormChange("doctor", e.target.value)}
              />
              <TextField
                label="Date"
                value={moment(editedAppointment.start).format("YYYY-MM-DD")}
                fullWidth
                disabled
              />
              <TextField
                label="Start Time"
                value={moment(editedAppointment.start).format("HH:mm")}
                fullWidth
                disabled
              />
              <TextField
                label="End Time"
                value={moment(editedAppointment.end).format("HH:mm")}
                fullWidth
                disabled
              />
              <TextField
                label="Notes"
                value={editedAppointment.notes}
                fullWidth
                onChange={(e) => handleFormChange("notes", e.target.value)}
              />
              <Button onClick={handleSubmit} variant="contained">
                Save Changes
              </Button>
              <Button onClick={handleCloseModal} variant="contained">
                Close
              </Button>
            </div>
          )}
        </Box>
      </MuiModal>
    </div>
  );
};

export default AppointmentCalendar;

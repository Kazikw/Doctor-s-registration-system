'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import './registerDoctor.css'

function RegisterDoctor() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Anna Kowalska",
      specialization: "Internista",
      availability: [
        { date: "2024-11-21", time: "10:00" },
        { date: "2024-11-22", time: "12:00" },
      ],
    },
    {
      id: 2,
      name: "Dr. Jan Nowak",
      specialization: "Kardiolog",
      availability: [
        { date: "2024-11-21", time: "14:00" },
        { date: "2024-11-23", time: "09:00" },
      ],
    },
    {
      id: 3,
      name: "Dr. Katarzyna Wiśniewska",
      specialization: "Dermatolog",
      availability: [
        { date: "2024-11-20", time: "11:00" },
        { date: "2024-11-24", time: "15:00" },
      ],
    },
    {
      id: 4,
      name: "Dr. Katarzyna Śmigło",
      specialization: "Alergolog",
      availability: [
        { date: "2024-11-27", time: "11:00" },
        { date: "2024-11-30", time: "15:00" },
      ],
    },
  ]);

  const [confirmingAppointment, setConfirmingAppointment] = useState(null);

  function handleRegister(doctorId, appointment) {
    setConfirmingAppointment({ doctorId, appointment });
  }

  const confirmAppointment = () => {
    const { doctorId, appointment } = confirmingAppointment;

    // Remove the selected appointment
    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              availability: doctor.availability.filter(
                (a) => a.date !== appointment.date || a.time !== appointment.time
              ),
            }
          : doctor
      )
    );

    setConfirmingAppointment(null); // Zamknij modal po zapisaniu
  };

  const closeConfirmationModal = () => {
    setConfirmingAppointment(null);
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>Zapisz się na wizytę</h1>
      </div>
      <div className="content">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctorContainer">
            <h2>{doctor.name}</h2>
            <p>Specjalizacja: {doctor.specialization}</p>
            <table className="availabilityTable">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {doctor.availability.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <button
                        className="inputButton"
                        onClick={() => handleRegister(doctor.id, appointment)}
                      >
                        Zapisz się
                      </button>
                    </td>
                  </tr>
                ))}
                {doctor.availability.length === 0 && (
                  <tr>
                    <td colSpan="3">Brak dostępnych terminów</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Modal potwierdzenia */}
      {confirmingAppointment && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Potwierdzenie</h2>
            <p>
              Czy na pewno chcesz zapisać się na wizytę dnia{" "}
              {confirmingAppointment.appointment.date} o godzinie{" "}
              {confirmingAppointment.appointment.time}?
            </p>
            <div className="modalButtons">
              <button className="inputButton" onClick={confirmAppointment}>
                Tak, zapisz
              </button>
              <button className="inputButton" onClick={closeConfirmationModal}>
                Nie, wróć
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo("/dashboard")}
          value="Wróć do panelu głównego"
        ></input>
      </div>
    </div>
  );
}

export default RegisterDoctor;

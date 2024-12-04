'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import './cancelDoctor.css';

function CancelDoctor(props) {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Anna Kowalska",
      specialization: "Internista",
      date: "2024-11-21",
      time: "10:00",  
    },
    {
      id: 2,
      name: "Dr. Jan Nowak",
      specialization: "Kardiolog",
      date: "2024-11-05",
      time: "14:00",
    },
  ]);

  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState(null);

  const cancelAppointment = () => {
    setDoctors(doctors.filter(doctor => doctor.id !== confirmingAppointmentId));
    setConfirmingAppointmentId(null); // Zamknij modal po usunięciu wizyty
  };

  const openConfirmationModal = (id) => {
    setConfirmingAppointmentId(id);
  };

  const closeConfirmationModal = () => {
    setConfirmingAppointmentId(null);
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>Lista wizyt pacjenta</h1>
      </div>
      <div className="content">
        {doctors.length > 0 ? (
          <table className="resultsTable">
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
                <th>Specjalizacja</th>
                <th>Data</th>
                <th>Godzina</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.date}</td>
                  <td>{doctor.time}</td>
                  <td>
                    {doctor.date !== "2024-11-05" ? (
                      <button
                        className="inputButton"
                        onClick={() => openConfirmationModal(doctor.id)}
                      >
                        Odwołaj wizytę
                      </button>
                    ) : (
                      <span className="pendingLabel">Nie można odwołać</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Brak dostępnych wizyt</p>
        )}
      </div>

      {/* Modal potwierdzenia */}
      {confirmingAppointmentId && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Potwierdzenie</h2>
            <p>Czy na pewno chcesz odwołać tę wizytę?</p>
            <div className="modalButtons">
              <button className="inputButton" onClick={cancelAppointment}>
                Tak, odwołaj
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
          onClick={navigateTo('/dashboard')}
          value="Wróć do panelu głównego"
        />
      </div>
    </div>
  );
}

export default CancelDoctor;

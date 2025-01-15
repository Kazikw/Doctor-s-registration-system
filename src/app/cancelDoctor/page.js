"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./cancelDoctor.css";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";

const currentDate = new Date().toLocaleDateString("de-DE");

function CancelDoctor() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [appointments, setAppointments] = useState([]);
  const [hoverMessage, setHoverMessage] = useState("");
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("Użytkownik nie jest zalogowany!");
        return;
      }

      const db = getFirestore();
      const userAppointmentsRef = collection(db, "wizyty", user.uid, "Wizyty");

      try {
        const snapshot = await getDocs(userAppointmentsRef);
        const appointmentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().doktor,

          specialization: doc.data().specialization,
          date: doc.data().date,
          time: doc.data().time,
        }));
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Błąd podczas pobierania danych: ", error);
      }
    };

    fetchAppointments();
  }, []);

  const deleteAppointmentFromFirestore = async (appointmentId) => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Użytkownik nie jest zalogowany!");
      return;
    }

    try {
      const db = getFirestore();
      const appointmentRef = doc(db, "wizyty", user.uid, "Wizyty", appointmentId);
      await deleteDoc(appointmentRef);

      setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== appointmentId));
    } catch (error) {
      console.error("Błąd podczas usuwania wizyty: ", error);
    }
  };

  const cancelAppointment = () => {
    if (confirmingAppointmentId) {
      deleteAppointmentFromFirestore(confirmingAppointmentId);
    }
    setConfirmingAppointmentId(null);
  };

  const openConfirmationModal = (id) => {
    setConfirmingAppointmentId(id);
  };

  const closeConfirmationModal = () => {
    setConfirmingAppointmentId(null);
  };

  const handleHover = () => {
    setHoverMessage("Upłynął czas na odwołanie wizyty");
  };

  const handleHoverOut = () => {
    setHoverMessage("");
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>Lista wizyt pacjenta</h1>
      </div>
      <div className="content">
        {appointments.length > 0 ? (
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
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.specialization}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    {appointment.date !== currentDate ? (
                      <button
                        className="inputButton"
                        onClick={() => openConfirmationModal(appointment.id)}
                      >
                        Odwołaj wizytę
                      </button>
                    ) : (
                      <span
                        className="pendingLabel"
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHoverOut}
                      >
                        Nie można odwołać
                      </span>
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

      {hoverMessage && (
        <div className="hoverMessage">
          <p>{hoverMessage}</p>
        </div>
      )}

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
          onClick={navigateTo("/dashboard")}
          value="Wróć do panelu głównego"
        />
      </div>
    </div>
  );
}

export default CancelDoctor;

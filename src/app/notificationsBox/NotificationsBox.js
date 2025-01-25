import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import './notificationsBox.css';

function NotificationsBox() {
  const [appointments, setAppointments] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [notificationMessages, setNotificationMessages] = useState([]);

  // Pobieranie wizyt z Firebase i zapis do localStorage
  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("Użytkownik nie jest zalogowany!");
        return;
      }

      try {
        const userAppointmentsRef = collection(db, "wizyty", user.uid, "Wizyty");
        const snapshot = await getDocs(userAppointmentsRef);
        const fetchedAppointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Zapisz dane do localStorage
        localStorage.setItem('appointments', JSON.stringify(fetchedAppointments));
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Błąd podczas pobierania wizyt:", error);
      }
    };

    // Sprawdzamy, czy dane wizyt są zapisane w localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      fetchAppointments();
    }
  }, []);

  // Pobieranie wyników badań z Firebase i zapis do localStorage
  useEffect(() => {
    const fetchTestResults = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("Użytkownik nie jest zalogowany!");
        return;
      }

      try {
        const userTestResultsRef = collection(db, "appointments", user.uid, "tests");
        const snapshot = await getDocs(userTestResultsRef);
        const fetchedResults = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().testName,
          date: doc.data().appointmentDate,
          status: doc.data().status,
          time: doc.data().appointmentTime
        }));

        // Zapisz dane do localStorage
        localStorage.setItem('testResults', JSON.stringify(fetchedResults));
        setTestResults(fetchedResults);
      } catch (error) {
        console.error("Błąd podczas pobierania wyników badań:", error);
      }
    };

    // Sprawdzamy, czy dane wyników badań są zapisane w localStorage
    const savedTestResults = localStorage.getItem('testResults');
    if (savedTestResults) {
      setTestResults(JSON.parse(savedTestResults));
    } else {
      fetchTestResults();
    }
  }, []);

  // Generowanie komunikatów powiadomień
  useEffect(() => {
    const generateNotifications = () => {
      const messages = [];

      // Komunikaty o badaniach
      if (testResults.length === 0) {
        messages.push("Dawno nie robiłeś badań. Może warto sprawdzić swój stan zdrowia?");
      } else {
        testResults.forEach((result) => {
          if (result.status === "W trakcie realizacji") {
            messages.push(`Badanie "${result.name}" jest w trakcie realizacji.`);
          } else if (result.status === "Zakonczone") {
            messages.push(`Wynik badania "${result.name}" jest do odbioru.`);
          } else if (result.status === "Zapisano na badanie") {
            messages.push(`Zapisano na badanie "${result.name}" dnia "${result.date}" o godzinie "${result.time}"`);
          }
        });
      }

      setNotificationMessages(messages);
    };

    generateNotifications();
  }, [testResults]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notifications-box">
      <div className="header">Powiadomienia</div>

      <div className="current-date-time">Aktualny czas: {currentDateTime}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* Wizyty */}
        <div className="appointments-section">
          <h3>Wizyty</h3>
          {appointments.length > 0 ? (
            <ul className="appointments-list">
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  Nadchodząca wizyta u dr. {appointment.doktor} ({appointment.specialization}) – {appointment.date} o {appointment.time}.
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak nadchodzących wizyt.</p>
          )}
        </div>

        {/* Badania */}
        <div className="notifications-section">
          <h3>Badania</h3>
          {notificationMessages.length > 0 ? (
            <ul className="notifications-list">
              {notificationMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          ) : (
            <p>Dawno nie robiłeś badań. Może warto sprawdzić swój stan zdrowia?</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default NotificationsBox;

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./notificationsBox.css";

function NotificationsBox() {
  const [appointments, setAppointments] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        console.error("Użytkownik nie jest zalogowany!");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userAppointmentsRef = collection(db, "wizyty", user.uid, "Wizyty");

    const unsubscribeAppointments = onSnapshot(userAppointmentsRef, (snapshot) => {
      const fetchedAppointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAppointments(fetchedAppointments);
      localStorage.setItem("appointments", JSON.stringify(fetchedAppointments));
    });

    return () => unsubscribeAppointments();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const userTestResultsRef = collection(db, "appointments", user.uid, "tests");

    const unsubscribeTestResults = onSnapshot(userTestResultsRef, (snapshot) => {
      const fetchedResults = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().testName,
        date: doc.data().appointmentDate,
        status: doc.data().status,
        time: doc.data().appointmentTime,
      }));

      setTestResults(fetchedResults);
      localStorage.setItem("testResults", JSON.stringify(fetchedResults));
    });

    return () => unsubscribeTestResults();
  }, [user]);

  useEffect(() => {
    const generateNotifications = () => {
      const messages = [];

      if (testResults.length === 0) {
        messages.push("Dawno nie robiłeś badań. Może warto sprawdzić swój stan zdrowia?");
      } else {
        testResults.forEach((result) => {
          if (result.status === "W trakcie realizacji") {
            messages.push(`Badanie "${result.name}" jest w trakcie realizacji.`);
          } else if (result.status === "Zakonczone") {
            messages.push(`Wynik badania "${result.name}" jest do odbioru.`);
          } else if (result.status === "Zapisano na badanie") {
            messages.push(
              `Zapisano na badanie "${result.name}" dnia "${result.date}" o godzinie "${result.time}".`
            );
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

      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
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

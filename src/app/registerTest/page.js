'use client'
import './registerTest.css'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function RegisterDoctor() {

  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);
  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Badanie krwi",
      availability: [
        { date: "2024-11-21", time: "09:00", price: 12 },
        { date: "2024-11-21", time: "14:00", price: 12 },
      ],
    },
    {
      id: 2,
      name: "Badanie moczu",
      availability: [
        { date: "2024-11-22", time: "10:00", price: 10 },
        { date: "2024-11-23", time: "15:30", price: 10 },
      ],
    },
    {
      id: 3,
      name: "USG jamy brzusznej",
      availability: [
        { date: "2024-11-25", time: "08:30", price: 150 },
        { date: "2024-11-25", time: "12:00", price: 150 },
      ],
    },
  ]);

  const [confirmingAppointment, setConfirmingAppointment] = useState(null);

  function handleRegister(testId, appointment) {
    setConfirmingAppointment({ testId, appointment });
  }

  // const confirmAppointment = () => {
  //   const { doctorId, appointment } = confirmingAppointment;

  //   // Remove the selected appointment
  //   setDoctors((prevDoctors) =>
  //     prevDoctors.map((doctor) =>
  //       doctor.id === doctorId
  //         ? {
  //             ...doctor,
  //             availability: doctor.availability.filter(
  //               (a) => a.date !== appointment.date || a.time !== appointment.time
  //             ),
  //           }
  //         : doctor
  //     )
  //   );

  //   setConfirmingAppointment(null); // Zamknij modal po zapisaniu
  // };

  const closeConfirmationModal = () => {
    setConfirmingAppointment(null);
  };

  function confirmAppointment() {
    const { testId, appointment } = confirmingAppointment;

    setTests((prevTests) => prevTests.map((test) => test.id === testId ? {
      ...test,
      availability: test.availability.filter(
        (a) => a.date !== appointment.date || a.time !== appointment.time
      ),
    }
  : test));
    setConfirmingAppointment(null);
  }

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>Zapisz się na badanie</h1>
      </div>
      <div className="content">
        {tests.map((test) => (
          <div key={test.id} className="testContainer">
            <h2>{test.name}</h2>
            <table className="availabilityTable">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th>Cena bez NFZ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {test.availability.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.price}</td>
                    <td>
                      <button
                        className="inputButton"
                        onClick={() => handleRegister(test.id, appointment)}
                      >
                        Zapisz się
                      </button>
                    </td>
                  </tr>
                ))}
                {test.availability.length === 0 && (
                  <tr>
                    <td colSpan="4">Brak dostępnych terminów</td>
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
          onClick={navigateTo('/dashboard')}
          value="Wroć do panelu głównego"
        ></input>
      </div>
    </div>
  );
}

export default RegisterDoctor;

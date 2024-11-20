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

  function handleRegister(doctorId, appointment) {
    alert(
      `Zarejestrowano na wizytę u ${doctors.find(d => d.id === doctorId).name} dnia ${appointment.date} o godzinie ${appointment.time}`
    );
  }

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
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <br />
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

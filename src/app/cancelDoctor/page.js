'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import './cancelDoctor.css'

function cancelDoctor(props) {
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
                      <a
                        className="inputButton"
                      >
                        Odwołaj wizytę
                      </a>
                    ) : (
                      <span className="pendingLabel">Nie można odwołać</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Brak dostępnych badań</p>
        )}
      </div>
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

export default cancelDoctor;

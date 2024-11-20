'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import './cancelTest.css'

function cancelTest(props) {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Morfologia krwi",
      date: "2024-11-15",
    },
    {
      id: 2,
      name: "Badanie moczu",
      date: "2024-11-10",
    },
    {
      id: 3,
      name: "Test na COVID-19",
      date: "2024-11-05",
    }
  ]);

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>Lista badań pacjenta</h1>
      </div>
      <div className="content">
        {tests.length > 0 ? (
          <table className="resultsTable">
            <thead>
              <tr>
                <th>Nazwa badania</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>{test.name}</td>
                  <td>{test.date}</td>
                  <td>
                    {test.date !== "2024-11-05" ? (
                      <a
                        className="inputButton"
                      >
                        Odwołaj badanie
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

export default cancelTest;

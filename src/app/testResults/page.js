'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import './testResults.css'

function TestResults() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Morfologia krwi",
      date: "2024-11-15",
      status: "Zakończone",
      result: "/results/morfologia.pdf"
    },
    {
      id: 2,
      name: "Badanie moczu",
      date: "2024-11-10",
      status: "W trakcie",
      result: null
    },
    {
      id: 3,
      name: "Test na COVID-19",
      date: "2024-11-05",
      status: "Zakończone",
      result: "/results/covid.pdf"
    }
  ]);

  return (
    <div className="resultPage">
      
      <div className="header">
        <div className="logo">HankMed</div>
      </div>

      <div className="titleContainer">
        <h2>Historia badań</h2>
      </div>

      <div className="content">
        {tests.length > 0 ? (
          <table className="resultsTable">
            <thead>
              <tr>
                <th>Nazwa badania</th>
                <th>Data</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>{test.name}</td>
                  <td>{test.date}</td>
                  <td>{test.status}</td>
                  <td>
                    {test.status === "Zakończone" ? (
                      <a
                        href={test.result}
                        className="inputButton"
                        download
                      >
                        Pobierz wynik
                      </a>
                    ) : (
                      <span className="pendingLabel">Wynik niedostępny</span>
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
          value="Wróć do panelu głównego"
        ></input>
      </div>
    </div>
  );
}

export default TestResults;

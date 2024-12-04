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

  const [showModal, setShowModal] = useState(false);
  const [testToCancel, setTestToCancel] = useState(null);

  const handleCancelTest = (test) => {
    setTestToCancel(test);
    setShowModal(true);
  };

  const confirmCancelTest = () => {
    setTests(tests.filter((test) => test.id !== testToCancel.id));
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setTestToCancel(null);
  };

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
                        onClick={() => handleCancelTest(test)}
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
          value="Wróć do panelu głównego"
        />
      </div>

      {/* Modal Confirmation */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Potwierdzenie</h2>
            <p>Czy na pewno chcesz odwołać to badanie?</p>
            <div className="modalButtons">
              <button className="inputButton" onClick={confirmCancelTest}>
                Tak, odwołaj
              </button>
              <button className="inputButton" onClick={closeModal}>
                Nie, wróć
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default cancelTest;

'use client';
//v06
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './cancelTest.css';
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";

const currentDate = new Date().toLocaleDateString("de-DE");

function CancelTest() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [tests, setTests] = useState([]);
  const [hoverMessage, setHoverMessage] = useState("");
  const [confirmingTestId, setConfirmingTestId] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("Użytkownik nie jest zalogowany!");
        return;
      }

      const db = getFirestore();
      const userTestsRef = collection(db, "appointments", user.uid, "tests");

      try {
        const snapshot = await getDocs(userTestsRef);
        const testsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().testName,
          date: doc.data().appointmentDate,
        }));
        setTests(testsData);
      } catch (error) {
        console.error("Błąd podczas pobierania danych: ", error);
      }
    };

    fetchTests();
  }, []);

  const deleteTestFromFirestore = async (testId) => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Użytkownik nie jest zalogowany!");
      return;
    }

    try {
      const db = getFirestore();
      const testRef = doc(db, "appointments", user.uid, "tests", testId);
      await deleteDoc(testRef);

      setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
    } catch (error) {
      console.error("Błąd podczas usuwania badania: ", error);
    }
  };

  const cancelTest = () => {
    if (confirmingTestId) {
      deleteTestFromFirestore(confirmingTestId);
    }
    setConfirmingTestId(null);
  };

  const openConfirmationModal = (id) => {
    setConfirmingTestId(id);
  };

  const closeConfirmationModal = () => {
    setConfirmingTestId(null);
  };
//toDo Poprawnic formatowanie
  const handleHover = () => {
    setHoverMessage("Upłynął czas na odwołanie badania");
  };

  const handleHoverOut = () => {
    setHoverMessage("");
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
                    {test.date !== currentDate ? (
                      <button
                        className="inputButton"
                        onClick={() => openConfirmationModal(test.id)}
                      >
                        Odwołaj badanie
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
          <p>Brak dostępnych badań</p>
        )}
      </div>

      {hoverMessage && (
        <div className="hoverMessage">
          <p>{hoverMessage}</p>
        </div>
      )}

      {confirmingTestId && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Potwierdzenie</h2>
            <p>Czy na pewno chcesz odwołać to badanie?</p>
            <div className="modalButtons">
              <button className="inputButton" onClick={cancelTest}>
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

export default CancelTest;

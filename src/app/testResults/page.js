'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";//zeby dzialalo: 
import { jsPDF } from "jspdf"; //  npm install jspdf
import './testResults.css';

function TestResults() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [tests, setTests] = useState([]);
  const [patientName, setPatientName] = useState(""); 

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
          status: doc.data().status,
          resultDetails: doc.data().resultDetails || null,
        }));
        setTests(testsData);

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setPatientName(userDoc.data().fullName || "Pacjent");
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych: ", error);
      }
    };

    fetchTests();
  }, []);

  const generatePDF = (test) => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");

    doc.setFontSize(18);
    doc.text("HankMed - Wyniki badań", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Imię i nazwisko pacjenta: ${patientName}`, 20, 40);
    doc.text(`Data badania: ${test.date}`, 20, 50);
    doc.text(`Nazwa badania: ${test.name}`, 20, 60);
    doc.text(`Status: ${test.status}`, 20, 70);

    doc.setFontSize(14);
    doc.text("Szczegóły wyników:", 20, 90);
    doc.setFontSize(12);
    const results = test.resultDetails || "Brak szczegółowych danych";
    const lines = doc.splitTextToSize(results, 170); 
    doc.text(lines, 20, 100);

 
    doc.save(`${test.name}_wynik.pdf`);
  };

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
                      <button
                        className="inputButton"
                        onClick={() => generatePDF(test)}
                      >
                        Pobierz wynik
                      </button>
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

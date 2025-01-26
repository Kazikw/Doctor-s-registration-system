'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { jsPDF } from "jspdf";
import styles from "./TestResults.module.css";

function TestResults() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [tests, setTests] = useState([]);
  const [patientName, setPatientName] = useState(""); 
  const [patientSurname, setPatientSurname] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("Użytkownik nie jest zalogowany!");
        return;
      }
      
      const userTestsRef = collection(db, "appointments", user.uid, "tests");

      try {
        const userInfo = doc(db, "users", user.uid);
        const docSnap = await getDoc(userInfo);
        const userData = docSnap.data();
        setPatientName(userData.name);
        setPatientSurname(userData.surname);
        const snapshot = await getDocs(userTestsRef);
        const testsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().testName,
          date: doc.data().appointmentDate,
          status: doc.data().status,
          resultDetails: doc.data().resultDetails || null,
        }));
        setTests(testsData);
        
      } catch (error) {
        console.error("Błąd podczas pobierania danych: ", error);
      }
    };

    fetchTests();
  }, []);

  const generatePDF = (test) => {
    const doc = new jsPDF();
    doc.setFont("Halvetica", "normal");

    doc.setFontSize(18);
    doc.text("HankMed - Wyniki badan", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Imie i nazwisko pacjenta: ${patientName} ${patientSurname}`, 20, 40);
    doc.text(`Data badania: ${test.date}`, 20, 50);
    doc.text(`Nazwa badania: ${test.name}`, 20, 60);
    doc.text(`Status: ${test.status}`, 20, 70);

    doc.setFontSize(14);
    doc.text("Szczegoly wynikow:", 20, 90);
    doc.setFontSize(12);
    const results = test.resultDetails || "Brak szczegolowych danych";
    const lines = doc.splitTextToSize(results, 170); 
    doc.text(lines, 20, 100);

 
    doc.save(`${test.name}_wynik.pdf`);
  };

  return (
    <div className={styles.resultContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <h1>Odbiór wyników badań laboratoryjnych</h1>
        </div>

        <div className={styles.content}>
          {tests.length > 0 ? (
            <table className={styles.resultsTable}>
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
                      {test.status === "Zakonczone" ? (
                        <button
                          className={styles.inputButton}
                          onClick={() => generatePDF(test)}
                        >
                          Pobierz wynik
                        </button>
                      ) : (
                        <span className={styles.pendingLabel}>Wynik niedostępny</span>
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

        <div className={styles.buttonContainer}>
          <input
            className={styles.inputButton}
            type="button"
            onClick={navigateTo('/dashboard')}
            value="Wróć do panelu głównego"
          />
        </div>
      </div>
    </div>
  );
}

export default TestResults;

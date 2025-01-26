'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DoctorHistory.module.css';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../firebase';

function DoctorHistory() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error('Użytkownik nie jest zalogowany!');
        return;
      }

      const db = getFirestore();
      const historyRef = collection(db, 'wizyty', user.uid, 'Wizyty');

      const q = query(historyRef, where('status', '==', 'Zakonczona'));

      try {
        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().doktor,
          specialization: doc.data().specialization,
          date: doc.data().date,
          time: doc.data().time,
          prescriptionCode: doc.data().prescriptionCode,
        }));

        setHistory(historyData);
      } catch (error) {
        console.error('Błąd podczas pobierania historii wizyt: ', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.historyContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <h1>Historia wizyt</h1>
        </div>
        <div className={styles.content}>
          {history.length > 0 ? (
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>Imię i nazwisko</th>
                  <th>Specjalizacja</th>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th>Kod recepty</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.name}</td>
                    <td>{entry.specialization}</td>
                    <td>{entry.date}</td>
                    <td>{entry.time}</td>
                    <td>{entry.prescriptionCode || 'Brak'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Brak historii wizyt</p>
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

export default DoctorHistory;

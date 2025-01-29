'use client';

import { useEffect, useState } from 'react';
import styles from './DoctorHistory.module.css';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { db } from '../firebase';
import { useRouter } from 'next/navigation';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);
  const [editedResult, setEditedResult] = useState('');
  const [editedStatus, setEditedStatus] = useState('Zapisano na badanie');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const testsRef = collection(db, 'appointments', userId, 'tests');
        const testsSnapshot = await getDocs(testsRef);
        const tests = testsSnapshot.docs.map(doc => ({
          id: doc.id,
          status: 'Zapisano na badanie', // Domyślna wartość jeśli brak w bazie
          ...doc.data()
        }));

        const visitsRef = collection(db, 'wizyty', userId, 'Wizyty');
        const visitsSnapshot = await getDocs(visitsRef);
        const visits = visitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return { tests, visits };
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        return { tests: [], visits: [] };
      }
    };

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        const usersData = await Promise.all(
          querySnapshot.docs.map(async doc => {
            const userData = doc.data();
            const additionalData = await fetchUserData(doc.id);
            
            return {
              id: doc.id,
              ...userData,
              tests: additionalData.tests,
              visits: additionalData.visits
            };
          })
        );

        setUsers(usersData);
      } catch (error) {
        console.error('Błąd podczas pobierania użytkowników:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSaveResult = async (userId, testId) => {
    try {
      const testRef = doc(db, 'appointments', userId, 'tests', testId);
      await updateDoc(testRef, {
        resultDetails: editedResult,
        status: editedStatus
      });

      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            tests: user.tests.map(test => 
              test.id === testId ? { 
                ...test, 
                resultDetails: editedResult,
                status: editedStatus 
              } : test
            )
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setEditingTestId(null);
      setEditedResult('');
      setEditedStatus('Zapisano na badanie');
    } catch (error) {
      console.error('Błąd podczas zapisywania zmian:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  return (
    <div className={styles.historyContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <h1>Lista użytkowników z danymi</h1>
        </div>
        
        <div className={styles.content}>
          {users.map(user => (
            <div key={user.id} className={styles.userSection}>
              <h2>{user.name} {user.surname} ({user.email})</h2>
              
              <div className={styles.dataSection}>
                <h3>Testy medyczne:</h3>
                {user.tests.length > 0 ? (
                  <table className={styles.resultsTable}>
                    <thead>
                      <tr>
                        <th>Nazwa testu</th>
                        <th>Data</th>
                        <th>Wynik</th>
                        <th>Status</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.tests.map(test => (
                        <tr key={test.id}>
                          <td>{test.testName || '-'}</td>
                          <td>{test.appointmentDate}</td>
                          <td>
                            {editingTestId === test.id ? (
                              <input
                                type="text"
                                value={editedResult}
                                onChange={(e) => setEditedResult(e.target.value)}
                                className={styles.editInput}
                              />
                            ) : (
                              test.resultDetails || '-'
                            )}
                          </td>
                          <td>
        {editingTestId === test.id ? (
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className={styles.statusSelect}
          >
            <option value="Zapisano na badanie">Zapisano na badanie</option>
            <option value="Wyniki gotowe">Wyniki gotowe</option>
          </select>
        ) : (
          <span className={`${styles.statusBadge} ${styles[test.status.replace(/\s+/g, '')]}`}>
            {test.status}
          </span>
        )}
      </td>
                          <td>
                            {editingTestId === test.id ? (
                              <button
                                onClick={() => handleSaveResult(user.id, test.id)}
                                className={styles.saveButton}
                              >
                                Zapisz
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingTestId(test.id);
                                  setEditedResult(test.resultDetails || '');
                                }}
                                className={styles.editButton}
                              >
                                Edytuj
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>Brak testów</p>}
              </div>

              <div className={styles.dataSection}>
                <h3>Wizyty:</h3>
                {user.visits.length > 0 ? (
                  <table className={styles.resultsTable}>
                    <thead>
                      <tr>
                        <th>Specjalizacja</th>
                        <th>Data</th>
                        <th>Lekarz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.visits.map(visit => (
                        <tr key={visit.id}>
                          <td>{visit.specialization || '-'}</td>
                          <td>{visit.date}</td>
                          <td>{visit.doktor || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>Brak wizyt</p>}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <input
            className={styles.inputButton}
            type="button"
            onClick={handleSignOut}
            value="Wyloguj"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
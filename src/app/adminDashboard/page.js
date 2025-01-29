'use client';

import { useEffect, useState } from 'react';
import styles from './adminDashboard.module.css';
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
  const [expandedUserIds, setExpandedUserIds] = useState([]);  // Przechowuje ID rozwiniętych użytkowników
  const [editedUserData, setEditedUserData] = useState({});  // Przechowuje edytowane dane użytkownika
  const [editingUserField, setEditingUserField] = useState(null); 
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

  const handleSaveUserData = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, editedUserData);

      // Zaktualizowanie danych w pamięci
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, ...editedUserData } : user
      );

      setUsers(updatedUsers);
      setEditedUserData({});
      setEditingUserField(null); // Zakończenie edycji
    } catch (error) {
      console.error('Błąd podczas zapisywania danych użytkownika:', error);
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

  // Funkcja rozwijająca sekcje dla danego użytkownika
  const toggleExpand = (userId) => {
    setExpandedUserIds(prevState => 
      prevState.includes(userId)
        ? prevState.filter(id => id !== userId)
        : [...prevState, userId]
    );
  };

  // Funkcja obsługująca zmianę wartości w formularzu edycji danych użytkownika
  const handleEditUserData = (field, currentValue) => {
    setEditingUserField(field); // Ustawia, które pole edytujemy
    setEditedUserData(prevState => ({
      ...prevState,
      [field]: currentValue // Ustawia aktualną wartość w edytowanym polu
    }));
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
              <div className={styles.userHeader} onClick={() => toggleExpand(user.id)}>
                <h2>{user.name} {user.surname} ({user.email})</h2>
                <button className={expandedUserIds.includes(user.id) ? styles.toggleButtonExpanded : styles.toggleButton}>
                  <span className={styles.toggleIcon}></span>
                  {expandedUserIds.includes(user.id) ? 'Zwiń' : 'Rozwiń'}
                </button>
              </div>

              {expandedUserIds.includes(user.id) && (
                <div className={styles.dataContainer}>
                  {/* Dane użytkownika */}
                  <div className={styles.sectionCard}>
                    <h3>Dane użytkownika:</h3>
                    <div className={styles.userData}>
                      <div className={styles.userDataRow}>
                        <span><strong>Imię:</strong></span>
                        {editingUserField ? (
                          <input 
                            type="text" 
                            value={editedUserData.name} 
                            onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })} 
                            className={styles.editInput} 
                          />
                        ) : (
                          <span>{user.name}</span>
                        )}
                      </div>

                      <div className={styles.userDataRow}>
                        <span><strong>Nazwisko:</strong></span>
                        {editingUserField ? (
                          <input 
                            type="text" 
                            value={editedUserData.surname} 
                            onChange={(e) => setEditedUserData({ ...editedUserData, surname: e.target.value })} 
                            className={styles.editInput} 
                          />
                        ) : (
                          <span>{user.surname}</span>
                        )}
                      </div>

                      <div className={styles.userDataRow}>
                        <span><strong>PESEL:</strong></span>
                        {editingUserField ? (
                          <input 
                            type="text" 
                            value={editedUserData.pesel} 
                            onChange={(e) => setEditedUserData({ ...editedUserData, pesel: e.target.value })} 
                            className={styles.editInput} 
                          />
                        ) : (
                          <span>{user.pesel}</span>
                        )}
                      </div>

                      <div className={styles.userDataRow}>
                        <span><strong>Alergie:</strong></span>
                        {editingUserField ? (
                          <input 
                            type="text" 
                            value={editedUserData.allergies} 
                            onChange={(e) => setEditedUserData({ ...editedUserData, allergies: e.target.value })} 
                            className={styles.editInput} 
                          />
                        ) : (
                          <span>{user.allergies || 'Brak danych'}</span>
                        )}
                      </div>

                      <div className={styles.userDataRow}>
                        <span><strong>Leki:</strong></span>
                        {editingUserField ? (
                          <input 
                            type="text" 
                            value={editedUserData.medications} 
                            onChange={(e) => setEditedUserData({ ...editedUserData, medications: e.target.value })} 
                            className={styles.editInput} 
                          />
                        ) : (
                          <span>{user.medications || 'Brak danych'}</span>
                        )}
                      </div>

                      <div className={styles.userDataRow}>
                        <span><strong>Choroby przewlekłe:</strong></span>
                        {editingUserField ? (
                          <input 
                            type="text" 
                            value={editedUserData.chronicDiseases} 
                            onChange={(e) => setEditedUserData({ ...editedUserData, chronicDiseases: e.target.value })} 
                            className={styles.editInput} 
                          />
                        ) : (
                          <span>{user.chronicDiseases || 'Brak danych'}</span>
                        )}
                      </div>

                      <button 
                        onClick={() => handleSaveUserData(user.id)} 
                        className={styles.saveButton}
                        style={{ display: editingUserField ? 'inline' : 'none' }} // Zmieniamy widoczność na podstawie edycji
                      >
                        Zapisz zmiany
                      </button>

                      {!editingUserField && (
                        <button
                          onClick={() => {
                            setEditingUserField('name');
                            setEditedUserData({
                              name: user.name,
                              surname: user.surname,
                              pesel: user.pesel,
                              allergies: user.allergies || '',
                              medications: user.medications || '',
                              chronicDiseases: user.chronicDiseases || ''
                            });
                          }}
                          className={styles.editButton}
                        >
                          Edytuj
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sekcja Testów */}
                  <div className={styles.sectionCard}>
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

                  {/* Sekcja Wizyt */}
                  <div className={styles.sectionCard}>
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
              )}
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

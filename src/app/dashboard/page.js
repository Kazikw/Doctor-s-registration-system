'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { doc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore"; // Dodano getDoc
import { onAuthStateChanged, signOut } from "firebase/auth";
import styles from "./Dashboard.module.css";
import NotificationsBox from "../notificationsBox/NotificationsBox";

function Dashboard() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [uid, setUid] = useState("");
  const router = useRouter();

  const navigateTo = (path) => () => router.push(path);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user == null) {
        router.push("/login");
        return;
      }
      const { uid } = user;
      setUid(uid);
      const userInfo = doc(db, "users", uid);
      await loadProfileData(userInfo);
      await checkAndUpdateVisits(uid);  // Wywołanie sprawdzania wizyt
    });

    return () => unsubscribe();
  }, []);

  const loadProfileData = async (ref) => {
    const docSnap = await getDoc(ref); // Użycie getDoc
    const data = docSnap.data();
    setName(data.name);
    setSurname(data.surname);
  };

  const generatePrescriptionCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const checkAndUpdateVisits = async (userId) => {
    const currentTime = new Date();
    console.log("Sprawdzanie wizyt dla użytkownika: ", userId, " Aktualny czas: ", currentTime.toISOString());
  
    const visitCollectionRef = collection(db, "wizyty", userId, "wizyty");
    const visitsSnapshot = await getDocs(visitCollectionRef);
    console.log("Znalezione wizyty: ", visitsSnapshot.size);
  
    visitsSnapshot.forEach(async (doc) => {
      const visitData = doc.data();
      const visitDate = new Date(`${visitData.date}T${visitData.time}:00`);
      console.log("Data wizyty:", visitDate.toISOString(), "Aktualny czas:", currentTime.toISOString());
  
      // Sprawdzamy, czy data wizyty jest mniejsza niż aktualny czas
      if (visitDate.toISOString() < currentTime.toISOString()) {
        // Zmieniamy status wizyty na "Zakończona" i uzupełniamy prescriptionCode
        await updateDoc(doc.ref, {
          status: "Zakończona",
          prescriptionCode: generatePrescriptionCode(),
        });
        console.log(`Wizyta ${doc.id} zakończona i przeniesiona do historii.`);
      } else {
        console.log(`Wizyta ${doc.id} jest w przyszłości, pomijamy.`);
      }
    });
  };

  const onClickLogout = () => {
    signOut(auth);
    navigateTo("/"); // Przekierowanie do strony logowania
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
        <nav className={styles.navbar}>
          <div className={styles.menuItem} onClick={navigateTo('/testResults')}>Odbierz wyniki badań</div>
          <div className={`${styles.menuItem} ${styles.dropdown}`}>
            Badania
            <div className={styles.dropdownMenu}>
              <div onClick={navigateTo('/registerTest')}>Zapisz się na badanie</div>
              <div onClick={navigateTo('/cancelTest')}>Odwołaj badanie</div>
            </div>
          </div>
          <div className={`${styles.menuItem} ${styles.dropdown}`}>
            Wizyty
            <div className={styles.dropdownMenu}>
              <div onClick={navigateTo('/registerDoctor')}>Zapisz się na wizytę</div>
              <div onClick={navigateTo('/doctorHistory')}>Historia wizyt</div>
              <div onClick={navigateTo('/cancelDoctor')}>Odwołaj wizytę</div>
            </div>
          </div>
        </nav>
        <div className={styles.accountSection}>
          <div className={styles.accountButton} onClick={navigateTo('/account')}>Moje konto</div>
          <div className={styles.logoutButton} onClick={onClickLogout}>Wyloguj się</div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.accountInfo}>
          <p>Dzień dobry, {name} {surname}</p>
        </div>
        <h1>Witaj w systemie zarządzania Twoimi wizytami i badaniami HankMed!</h1>
        <div className={styles.notificationsWrapper}>
          <NotificationsBox uid={uid} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

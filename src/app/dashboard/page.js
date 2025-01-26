'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { doc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
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
      if (!user) {
        router.push("/login");
        return;
      }
      setUid(user.uid);
      const userInfoRef = doc(db, "users", user.uid);
      await loadProfileData(userInfoRef);
      await checkAndUpdateVisits(user.uid);
      await checkAndUpdateTests(user.uid);
    });

    return () => unsubscribe();
  }, []);

  const loadProfileData = async (ref) => {
    try {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const { name, surname } = docSnap.data();
        setName(name);
        setSurname(surname);
      } else {
        console.error("Brak danych użytkownika.");
      }
    } catch (error) {
      console.error("Błąd podczas ładowania danych profilu:", error.message);
    }
  };

  const generatePrescriptionCode = () =>
    Math.floor(1000 + Math.random() * 9000).toString();

  const checkAndUpdateVisits = async (userId) => {
    const currentTime = new Date();
    const visitCollectionRef = collection(db, "wizyty", userId, "Wizyty");

    try {
      const visitsSnapshot = await getDocs(visitCollectionRef);
      for (const docSnap of visitsSnapshot.docs) {
        const visitData = docSnap.data();
        const [day, month, year] = visitData.date.split(".");
        const visitDate = new Date(`${year}-${month}-${day}T${visitData.time}:00`);

        if (visitDate < currentTime) {
          try {
            await updateDoc(docSnap.ref, {
              status: "Zakończona",
              prescriptionCode: generatePrescriptionCode(),
            });
            console.log(`Wizyta ${docSnap.id} została zakończona.`);
          } catch (updateError) {
            console.error(`Błąd aktualizacji wizyty ${docSnap.id}:`, updateError.message);
          }
        } else {
          console.log(`Wizyta ${docSnap.id} jeszcze się nie odbyła.`);
        }
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania wizyt:", error.message);
    }
  };

  const checkAndUpdateTests = async (userId) => {
    const currentTime = new Date();
    const testsCollectionRef = collection(db, "appointments", userId, "tests");
  
    try {
      const testsSnapshot = await getDocs(testsCollectionRef);
      for (const docSnap of testsSnapshot.docs) {
        const testData = docSnap.data();
        const [day, month, year] = testData.appointmentDate.split(".");
        const testDate = new Date(`${year}-${month}-${day}T${testData.appointmentTime}:00`);
  
        if (testDate < currentTime) {
          try {
            await updateDoc(docSnap.ref, {
              status: "Wyniki gotowe",
            });
            console.log(`Badanie ${docSnap.id} zostało zaktualizowane jako zakończone.`);
          } catch (updateError) {
            console.error(`Błąd aktualizacji badania ${docSnap.id}:`, updateError.message);
          }
        } else {
          console.log(`Badanie ${docSnap.id} jeszcze się nie odbyło.`);
        }
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania badań:", error.message);
    }
  };
  

  const onClickLogout = () => {
    signOut(auth).then(() => navigateTo("/")()).catch((error) => console.error("Błąd podczas wylogowywania:", error.message));
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
        <nav className={styles.navbar}>
          <div className={styles.menuItem} onClick={navigateTo("/testResults")}>Odbierz wyniki badań</div>
          <div className={`${styles.menuItem} ${styles.dropdown}`}>
            Badania
            <div className={styles.dropdownMenu}>
              <div onClick={navigateTo("/registerTest")}>Zapisz się na badanie</div>
              <div onClick={navigateTo("/cancelTest")}>Odwołaj badanie</div>
            </div>
          </div>
          <div className={`${styles.menuItem} ${styles.dropdown}`}>
            Wizyty
            <div className={styles.dropdownMenu}>
              <div onClick={navigateTo("/registerDoctor")}>Zapisz się na wizytę</div>
              <div onClick={navigateTo("/doctorHistory")}>Historia wizyt</div>
              <div onClick={navigateTo("/cancelDoctor")}>Odwołaj wizytę</div>
            </div>
          </div>
        </nav>
        <div className={styles.accountSection}>
          <div className={styles.accountButton} onClick={navigateTo("/account")}>Moje konto</div>
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

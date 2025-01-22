'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Dashboard.module.css";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const navigateTo = (path) => () => router.push(path);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user == null) {
        router.push("/login")
        return;
      }
      const { uid } = user;
      setUid(uid);
      const userInfo = doc(db, "users", uid);
      loadProfileData(userInfo);
    });

    
    return () => unsubscribe();
  }, []);

    async function loadProfileData(ref) {
      const docSnap = await getDoc(ref);
      const data = docSnap.data();
  
      setName(data.name);
      setSurname(data.surname);
    }

    function onClickLogout() {
      signOut(auth);
      navigateTo("/");
    }

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
      </main>
    </div>
  );
}

export default Dashboard;
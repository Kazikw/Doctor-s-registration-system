'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Account.module.css";

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const navigateTo = (path) => () => router.push(path);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    const getUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("Brak danych użytkownika w Firestore");
      }
      setLoading(false);
    };

    getUserData();
  }, [router]);


  return (
    <div className={styles.accountContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
      </header>

      <div className={styles.mainContent}>
        <h2 className={styles.h2Style}>Moje konto</h2>
        <div className={styles.userInfo}>
          {userData ? (
            <>
              <p><strong>Imię:</strong> {userData.name}</p>
              <p><strong>Nazwisko:</strong> {userData.surname}</p>
              <p><strong>PESEL:</strong> {userData.pesel}</p>
              <p><strong>Alergie:</strong> {userData.allergies}</p>
              <p>{userData.allergiesInfo}</p>
              <p><strong>Leki:</strong> {userData.medications}</p>
              <p>{userData.medicationsInfo}</p>
              <p><strong>Choroby przewlekłe:</strong> {userData.chronicDiseases}</p>
              <p>{userData.diseasesInfo}</p>
            </>
          ) : (
            <p>Brak danych użytkownika.</p>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.viewHistoryButton} onClick={navigateTo('/testResults')}>
            Historia badań
          </button>
          <button className={styles.viewHistoryButton} onClick={navigateTo('/doctorHistory')}>
            Historia wizyt
          </button>
          <button className={styles.returnHomeButton} onClick={navigateTo('/dashboard')}>
          Wróć do panelu głównego
          </button>
        </div>
      </div>
    </div>
  );
}

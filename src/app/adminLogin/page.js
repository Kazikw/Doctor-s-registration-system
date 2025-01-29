'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import styles from "./Login.module.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          router.push("/adminDashboard");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);


  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (email === "") {
      setEmailError("Proszę wprowadzić adres e-mail");
      return;
    }

    if (password === "") {
      setPasswordError("Proszę wprowadzić prawidłowe hasło");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        await auth.signOut();
        setPasswordError("Brak uprawnień administratora");
        return;
      }

      console.log("Zalogowano jako administrator!");
      router.push("/adminDashboard");
    } catch (error) {
      console.error("Błąd logowania:", error);
      setPasswordError(
        error.code === "auth/invalid-credential" 
          ? "Nieprawidłowy e-mail lub hasło" 
          : "Wystąpił błąd podczas logowania"
      );
    }
  };

  const handleBackButtonClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.loginPage}>

      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
      </header>

      <main className={styles.mainContent}>
        <h1>Admin</h1>
        <div className={styles.inputContainer}>
          <input
            value={email}
            type="email"
            placeholder="Wpisz swój adres e-mail"
            onChange={(ev) => setEmail(ev.target.value)}
            className={styles.inputBox}
          />
          <label className={styles.errorLabel}>{emailError}</label>
        </div>
        <div className={styles.inputContainer}>
          <input
            value={password}
            type="password"
            placeholder="Wpisz swoje hasło"
            onChange={(ev) => setPassword(ev.target.value)}
            className={styles.inputBox}
          />
          <label className={styles.errorLabel}>{passwordError}</label>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleLogin} className={styles.loginButton}>
            Zaloguj się
          </button>
          <button onClick={handleBackButtonClick} className={styles.backButton}>
            Wstecz
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;

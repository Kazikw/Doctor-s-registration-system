'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithEmailAndPassword } from "../firebase";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

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

      console.log("Zalogowano pomyślnie!", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Błąd logowania: ", error.message);
      setPasswordError("Nieprawidłowy e-mail lub hasło.");
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
        <h1>Zaloguj się</h1>
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

export default Login;

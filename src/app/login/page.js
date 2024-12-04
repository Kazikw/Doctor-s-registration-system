'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithEmailAndPassword } from "../firebase";

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
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Zaloguj się</div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={email}
          type="email"
          placeholder="Wpisz swój adres e-mail"
          onChange={(ev) => setEmail(ev.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={password}
          type="password"
          placeholder="Wpisz swoje hasło"
          onChange={(ev) => setPassword(ev.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value="Zaloguj się"
          type="button"
          onClick={handleLogin}
          className="inputButton"
        />
      </div>
      <div className="backButtonContainer">
        <button onClick={handleBackButtonClick} className="backButton">
          Wstecz
        </button>
      </div>
    </div>
  );
}

export default Login;
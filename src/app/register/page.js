'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, createUserWithEmailAndPassword, addDoc, collection } from "../firebase";

function Register(props) {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [pesel, setPesel] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [peselError, setPeselError] = useState("");
  const [emailError, setEmailError] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    setNameError("");
    setSurnameError("");
    setPeselError("");
    setPasswordError("");
    setEmailError("");

    if (name === "") {
      setNameError("Proszę wprowadzić imię");
      return;
    }

    if (surname === "") {
      setSurnameError("Proszę wprowadzić nazwisko");
      return;
    }

    if (pesel.length !== 11) {
      setPeselError("Proszę wprowadzić prawidłowy numer pesel");
      return;
    }

    if (email === "") {
      setEmailError("Proszę wprowadzić adres e-mail");
      return;
    }

    if (password === "") {
      setPasswordError("Proszę wprowadzić prawidłowe hasło");
      return;
    }

    if (password.length < 7) {
      setPasswordError("Hasło musi mieć przynajmniej 8 znaków");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await addDoc(collection(db, "users"), {
        name,
        surname,
        pesel,
        email: user.email,
        uid: user.uid
      });

      console.log("Użytkownik zarejestrowany!");
      await router.push("/dashboard");
    } catch (error) {
      console.error("Błąd rejestracji: ", error.message);
      setPasswordError("Coś poszło nie tak, spróbuj ponownie.");
    }
  };

  const handleBackButtonClick = () => {
    router.push("/");
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Stwórz konto</div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={name}
          placeholder="Wpisz swoje imię"
          onChange={(ev) => setName(ev.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{nameError}</label>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={surname}
          type="text"
          placeholder="Wpisz swoje nazwisko"
          onChange={(ev) => setSurname(ev.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{surnameError}</label>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={pesel}
          placeholder="Wpisz swój numer PESEL"
          onChange={(ev) => setPesel(ev.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{peselError}</label>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={email}
          type="email"
          placeholder="Wpisz swój adres email"
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
          value="Stwórz konto"
          type="button"
          onClick={handleRegister}
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

export default Register;

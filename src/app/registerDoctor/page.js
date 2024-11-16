'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

function RegisterDoctor(props) {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [pesel, setPesel] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [peselError, setPeselError] = useState("");

  const router = useRouter();

  function onButtonClick() {
    setNameError("");
    setSurnameError("");
    setPeselError("");
    setPasswordError("");
    

    if ("" === name) {
      setNameError("Proszę wprowadzić imię");
      return;
    }

    if ("" === surname) {
      setSurnameError("Proszę wprowadzić nazwisko");
      return;
    }

    if (pesel.length !== 11) {
      setPeselError("Proszę wprowadzić prawidłowy numer pesel");
      return;
    }

    if ("" === password) {
      setPasswordError("Proszę wprowadzić prawidłowe hasło");
      return;
    }

    if (password.length < 7) {
      setPasswordError("Hasło musi mieć przynajmniej 8 znaków");
      return;
    }
    
    router.push("/dashboard");
  }

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Zapisz się na wizytę(placeholder)</div>
      </div>
      {/* <br />
      <div className="inputContainer">
        <input
          value={name}
          placeholder="Wpisz swoje imie"
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
          onClick={onButtonClick}
          className="inputButton"
        />
      </div> */}
    </div>
  );
}

export default RegisterDoctor;

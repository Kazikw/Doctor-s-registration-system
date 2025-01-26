'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db, createUserWithEmailAndPassword } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Register.module.css";

function Register(props) {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [pesel, setPesel] = useState("");
  const [email, setEmail] = useState("");
  const [medications, setMedications] = useState("");
  const [chronicDiseases, setChronicDiseases] = useState("");
  const [allergies, setAllergies] = useState("");
  const [allergiesInfo, setAllergiesInfo] = useState("");
  const [medicationsInfo, setMedicationsInfo] = useState("");
  const [diseasesInfo, setDiseasesInfo] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [peselError, setPeselError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [medicationsError, setMedicationsError] = useState("");
  const [chronicDiseasesError, setChronicDiseasesError] = useState("");
  const [allergiesError, setAllergiesError] = useState("");
  const [additionalInfoError, setAdditionalInfoError] = useState("");

  const [showMedicationsInfo, setShowMedicationsInfo] = useState(false);
  const [showAllergiesInfo, setShowAllergiesInfo] = useState(false);
  const [showDiseasesInfo, setShowDiseasesInfo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowAllergiesInfo(allergies === "Tak");
    setShowDiseasesInfo(chronicDiseases === "Tak");
    setShowMedicationsInfo(medications === "Tak");
  }, [medications, chronicDiseases, allergies]);

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
      setPeselError("Proszę wprowadzić prawidłowy numer PESEL");
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

      await setDoc(doc(db, "users", user.uid), {
        name,
        surname,
        pesel,
        medications,
        chronicDiseases,
        allergies,
        allergiesInfo,
        medicationsInfo,
        diseasesInfo,
        email: user.email,
        uid: user.uid
      });

      console.log("Użytkownik zarejestrowany!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Błąd rejestracji: ", error.message);
      setPasswordError("Coś poszło nie tak, spróbuj ponownie.");
    }
  };

  const handleBackButtonClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.registerPage}>
      <header className={styles.header}>
        <div className={styles.logo}>HankMed</div>
      </header>
      <main className={styles.mainContainer}>
        <div className={styles.titleContainer}>Stwórz konto</div>
        <div className={styles.inputContainer}>
          <input
            value={name}
            placeholder="Wpisz swoje imię"
            onChange={(ev) => setName(ev.target.value)}
            className={styles.inputBox}
          />
          <label className={styles.errorLabel}>{nameError}</label>
        </div>
        <div className={styles.inputContainer}>
          <input
            value={surname}
            type="text"
            placeholder="Wpisz swoje nazwisko"
            onChange={(ev) => setSurname(ev.target.value)}
            className={styles.inputBox}
          />
          <label className={styles.errorLabel}>{surnameError}</label>
        </div>
        <div className={styles.inputContainer}>
          <input
            value={pesel}
            placeholder="Wpisz swój numer PESEL"
            onChange={(ev) => setPesel(ev.target.value)}
            className={styles.inputBox}
          />
          <label className={styles.errorLabel}>{peselError}</label>
        </div>
        <div className={styles.inputContainer}>
          <select
            value={medications}
            onChange={(ev) => setMedications(ev.target.value)}
            className={styles.inputBox}
          >
            <option value="">Czy przyjmuje Pan/Pani leki?</option>
            <option value="Tak">Tak</option>
            <option value="Nie">Nie</option>
          </select>
          <label className={styles.errorLabel}>{medicationsError}</label>
        </div>
        {showMedicationsInfo && (
          <div className={styles.inputContainer}>
          <textarea
            value={medicationsInfo}
            type="text"
            placeholder="Proszę podać szczegóły (leki)"
            onChange={(ev) => setMedicationsInfo(ev.target.value)}
            className={styles.inputBox}
            rows={2}
          />
        </div>
        )}
        <div className={styles.inputContainer}>
          <select
            value={chronicDiseases}
            onChange={(ev) => setChronicDiseases(ev.target.value)}
            className={styles.inputBox}
          >
            <option value="">Czy choruje Pan/Pani na choroby przewlekłe?</option>
            <option value="Tak">Tak</option>
            <option value="Nie">Nie</option>
          </select>
          <label className={styles.errorLabel}>{chronicDiseasesError}</label>
        </div>
        {showDiseasesInfo && (
          <div className={styles.inputContainer}>
          <textarea
            value={diseasesInfo}
            type="text"
            placeholder="Proszę podać szczegóły (choroby przewlekłe)"
            onChange={(ev) => setDiseasesInfo(ev.target.value)}
            className={styles.inputBox}
            rows={2}
          />
        </div>
        )}
        <div className={styles.inputContainer}>
          <select
            value={allergies}
            onChange={(ev) => setAllergies(ev.target.value)}
            className={styles.inputBox}
          >
            <option value="">Czy ma Pan/Pani alergie?</option>
            <option value="Tak">Tak</option>
            <option value="Nie">Nie</option>
          </select>
          <label className={styles.errorLabel}>{allergiesError}</label>
        </div>
        {showAllergiesInfo && (
          <div className={styles.inputContainer}>
          <textarea
            value={allergiesInfo}
            type="text"
            placeholder="Proszę podać szczegóły (alergie)"
            onChange={(ev) => setAllergiesInfo(ev.target.value)}
            className={styles.inputBox}
            rows={2}
          />
        </div>
        )}
        <div className={styles.inputContainer}>
          <input
            value={email}
            type="email"
            placeholder="Wpisz swój adres email"
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
        <div className={styles.inputContainer}>
          <button onClick={handleRegister} className={styles.inputButton}>
            Stwórz konto
          </button>
        </div>
        <div className={styles.backButtonContainer}>
          <button onClick={handleBackButtonClick} className={styles.backButton}>
            Wstecz
          </button>
        </div>
      </main>
    </div>
  );
}

export default Register;

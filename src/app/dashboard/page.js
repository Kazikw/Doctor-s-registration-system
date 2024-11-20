'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
function Dashboard() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);


  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  return(
  <div className="mainContainer">
    <div className="titleContainer">
      <h1>HANKMED</h1>
    </div>
    <div className="header">
      <h3>Jesteś zalogowany jako: {name || "Użytkownik"} {surname || "Testowy"}</h3>
    </div>
    <br />
    <div className="welcome-section">
      <p>Witaj w systemie zarządzania Twoimi wizytami i badaniami HANKMED!</p>
    </div>
    <br />
    <div className="nav">
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/testResults')}
          value="Odbierz wyniki badań"
        ></input>
      </div>
      <br />
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/registerTest')}
          value="Zapisz się na badanie"
        ></input>
      </div>
      <br />
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/registerDoctor')}
          value="Zapisz się na wizytę"
        ></input>
      </div>
      <br />
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/cancelTest')}
          value="Odwołaj badanie"
        ></input>
      </div>
      <br />
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/cancelDoctor')}
          value="Odwołaj wizytę"
        ></input>
      </div>
      <br />
      <div className="buttonContainer">
        <input
          className="inputButton logout"
          type="button"
          onClick={navigateTo('/')}
          value="Wyloguj się"
        ></input>
      </div>
    </div>
  </div>
  );
}

export default Dashboard;
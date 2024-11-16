'use client'

import { useRouter } from "next/navigation";
function Dashboard() {
  const router = useRouter();

  function onButtonClickRegisterTest() {
    router.push("/registerTest");
  }

  function onButtonClickTestResults() {
    router.push("/testResults")
  }

  function onButtonClickRegisterDoctor() {
    router.push("/registerDoctor")
  }

  function onButtonClickCancelDoctor() {
    router.push("/cancelDoctor")
  }

  function onButtonClickCancelTest() {
    router.push("/cancelTest")
  }

  function onButtonClickLogOut() {
    router.push("/")
  }

  return(
  <div className="mainContainer">
    <div className="titleContainer">
      <h1>HANKMED</h1>
    </div>
    <div className="nav">
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickTestResults}
          value="Odbierz wyniki badań"
        ></input>
      </div>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickRegisterTest}
          value="Zapisz się na badanie"
        ></input>
      </div>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickRegisterDoctor}
          value="Zapisz się na wizytę"
        ></input>
      </div>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickCancelTest}
          value="Odwołaj badanie"
        ></input>
      </div>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickCancelDoctor}
          value="Odwołaj wizytę"
        ></input>
      </div>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickLogOut}
          value="Wyloguj się"
        ></input>
      </div>
    </div>
  </div>
  );
}

export default Dashboard;
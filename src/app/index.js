'use client'

import { useRouter } from "next/navigation";

function Home(props) {
  const { loggedIn, username } = props;
  const router = useRouter();

  function onButtonClickLogin() {
    router.push("/login");
  }

  function onButtonClickRegister() {
    router.push("/register");
  }

  return (
    <div className="mainContainer">
      {/* Tytuł strony */}
      <div className="titleContainer">
        <h1>HankMed</h1>
      </div>

      {/* Kontener dla sekcji rejestracji i logowania */}
      <div className="loginRegisterContainer">
        {/* Sekcja rejestracji */}
        <div className="formContainer">
          <div className="titleRow">
            <p>Stwórz konto:</p>
          </div>
          <div className="buttonRow">
            <input
              className="inputButton"
              type="button"
              onClick={onButtonClickRegister}
              value="Zarejestruj się"
            ></input>
          </div>
        </div>

        {/* Pionowa linia oddzielająca */}
        <div className="separator"></div>

        {/* Sekcja logowania */}
        <div className="formContainer">
          <div className="titleRow">
            <p>Mam już konto:</p>
          </div>
          <div className="buttonRow">
            <input
              className="inputButton"
              type="button"
              onClick={onButtonClickLogin}
              value="Zaloguj się"
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

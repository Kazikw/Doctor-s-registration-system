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
      {/* <Navbar /> */}
      <div className="titleContainer">
        <h1>HANKMED</h1>
      </div>
      <p>Stwórz konto:</p>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickRegister}
          value="Zarejestruj się"
        ></input>
      </div>
      <p>Mam już konto:</p>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClickLogin}
          value="Zaloguj się"
        ></input>
      </div>
    </div>
  );
}

export default Home;

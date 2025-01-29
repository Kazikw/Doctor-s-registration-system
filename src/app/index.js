'use client'

import { useRouter } from "next/navigation";
import styles from './page.module.css';

function Home(props) {
  const { loggedIn, username } = props;
  const router = useRouter();

  function onButtonClickLogin() {
    router.push("/login");
  }

  function onButtonClickRegister() {
    router.push("/register");
  }

  function onButtonClickAdmin() {
    router.push("/adminLogin");
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1>HankMed</h1>
          <input
              className={styles.adminButton}
              type="button"
              onClick={onButtonClickAdmin}
              value="Admin"
          />

      </div>
        
          
    

      <div className={styles.titleContainer}>
        <h2>Witaj w aplikacji HankMed!</h2>
      </div>

      
      <div className={styles.loginRegisterContainer}>
        <div className={styles.formContainer}>
          <div className={styles.titleRow}>
            <p>Stwórz konto:</p>
          </div>
          <div className={styles.buttonRow}>
            <input
              className={styles.inputButton}
              type="button"
              onClick={onButtonClickRegister}
              value="Zarejestruj się"
            />
          </div>
        </div>
        
        
        <div className={styles.formContainer}>
          <div className={styles.titleRow}>
            <p>Mam już konto:</p>
          </div>
          <div className={styles.buttonRow}>
            <input
              className={styles.inputButton}
              type="button"
              onClick={onButtonClickLogin}
              value="Zaloguj się"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

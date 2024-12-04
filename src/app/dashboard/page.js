'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const navigateTo = (path) => () => router.push(path);

  useEffect(() => {
    const user = auth.currentUser;
    
    if (!user) {
      router.push("/login");
      return;
    }


    const getUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("Brak danych użytkownika w Firestore");
      }
      setLoading(false);
    };

    getUserData();
  }, [router]);



  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>HankMed</h1>
      </div>
      <div className="header">
        <h3>Jesteś zalogowany jako: {userData?.name || "Użytkownik"} {userData?.surname || "Testowy"}</h3>
      </div>
      <br />
      <div className="welcome-section">
        <p>Witaj w systemie zarządzania Twoimi wizytami i badaniami HankMed!</p>
      </div>
      <br />
      <div className="nav">
        <div className="buttonContainer">
          <input
            className="inputButton"
            type="button"
            onClick={navigateTo('/testResults')}
            value="Odbierz wyniki badań"
          />
        </div>
        <br />
        <div className="buttonContainer">
          <input
            className="inputButton"
            type="button"
            onClick={navigateTo('/registerTest')}
            value="Zapisz się na badanie"
          />
        </div>
        <br />
        <div className="buttonContainer">
          <input
            className="inputButton"
            type="button"
            onClick={navigateTo('/registerDoctor')}
            value="Zapisz się na wizytę"
          />
        </div>
        <br />
        <div className="buttonContainer">
          <input
            className="inputButton"
            type="button"
            onClick={navigateTo('/cancelTest')}
            value="Odwołaj badanie"
          />
        </div>
        <br />
        <div className="buttonContainer">
          <input
            className="inputButton"
            type="button"
            onClick={navigateTo('/cancelDoctor')}
            value="Odwołaj wizytę"
          />
        </div>
        <br />
        <div className="buttonContainer">
          <input
            className="inputButton logout"
            type="button"
            onClick={navigateTo('/')}
            value="Wyloguj się"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

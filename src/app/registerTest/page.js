'use client'
import './registerTest.css'
import { useRouter } from 'next/navigation';

function RegisterDoctor() {

  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);
  const tests = [
    {
      id: 1,
      name: "Badanie krwi",
      availability: [
        { date: "2024-11-21", time: "09:00", price: 50 },
        { date: "2024-11-21", time: "14:00", price: 50 },
      ],
    },
    {
      id: 2,
      name: "Badanie moczu",
      availability: [
        { date: "2024-11-22", time: "10:00", price: 100 },
        { date: "2024-11-23", time: "15:30", price: 100 },
      ],
    },
    {
      id: 3,
      name: "USG jamy brzusznej",
      availability: [
        { date: "2024-11-25", time: "08:30", price: 150 },
        { date: "2024-11-25", time: "12:00", price: 150 },
      ],
    },
  ];

  function handleRegister(testId, appointment) {
    alert(
      `Zarejestrowano na ${tests.find(t => t.id === testId).name} dnia ${appointment.date} o godzinie ${appointment.time}`
    );
  }

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <h1>Zapisz się na badanie</h1>
      </div>
      <div className="content">
        {tests.map((test) => (
          <div key={test.id} className="testContainer">
            <h2>{test.name}</h2>
            <table className="availabilityTable">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th>Cena bez NFZ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {test.availability.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.price}</td>
                    <td>
                      <button
                        className="inputButton"
                        onClick={() => handleRegister(test.id, appointment)}
                      >
                        Zapisz się
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/dashboard')}
          value="Wroć do panelu głównego"
        ></input>
      </div>
    </div>
  );
}

export default RegisterDoctor;

"use client";
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './registerTest.css';
import { useRouter } from 'next/navigation';

function RegisterTest() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirming, setConfirming] = useState(false);

  const categories = {
    'Badania laboratoryjne': ['Morfologia', 'Glukoza', 'Cholesterol', 'Elektrolity'],
    'Diagnostyka obrazowa': ['USG jamy brzusznej', 'RTG płuc', 'MRI'],
    'Badania funkcjonalne': ['EKG', 'Spirometria', 'Holter EKG'],
    'Endoskopia': ['Gastroskopia', 'Kolonoskopia'],
    'Profilaktyczne i przesiewowe': ['Cytologia', 'Mammografia', 'Badanie przesiewowe cukrzycy'],
    'Szczepienia': ['Grypa', 'COVID-19', 'HPV']
  };

  const slots = ['09:00', '10:30', '13:00'];

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setAvailableTests(categories[category] || []);
    setSelectedTest('');
    setSelectedDate(null);
    setSelectedSlot('');
  };

  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
    setSelectedDate(null);
    setSelectedSlot('');
  };

  const isSubmitDisabled = !(selectedCategory && selectedTest && selectedDate && selectedSlot);

  const handleSubmit = () => {
    setConfirming(true);
  };

  const confirmSubmit = () => {
    setConfirming(false);
    alert(`Zapisano na badanie ${selectedTest} dnia ${selectedDate.toLocaleDateString()} o godz. ${selectedSlot}.`);
  };

  // Disable weekends
  const tileDisabled = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Disable Sundays (0) and Saturdays (6)
  };

  return (
    <div className="mainContainer">
      <h1>Zapisz się na badanie</h1>
      <div className="formWrapper">
        <div className="formContainer">
          <div className="formFields">
            <label>
              Wybierz kategorię badania:
              <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">-- Wybierz --</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            {availableTests.length > 0 && (
              <label>
                Wybierz rodzaj badania:
                <select value={selectedTest} onChange={handleTestChange}>
                  <option value="">-- Wybierz --</option>
                  {availableTests.map((test) => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {selectedTest && (
            <>
              <div className="calendarContainer">
                <h3>Wybierz datę:</h3>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={tileDisabled}
                />
              </div>

              {selectedDate && (
                <div className="slotContainer">
                  <h3>Wybierz godzinę:</h3>
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`slot ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {selectedDate && (
          <button
            className={`submitButton ${isSubmitDisabled ? 'disabled' : 'enabled'}`}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            Zapisz się
          </button>
        )}
      </div>

      <div className="buttonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={navigateTo('/dashboard')}
          value="Wróć do panelu głównego"
        />
      </div>

      {confirming && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Potwierdzenie terminu</h2>
            <p>
              Czy na pewno chcesz zapisać się na badanie <strong>{selectedTest}</strong> dnia <strong>{selectedDate.toLocaleDateString()}</strong> o godzinie <strong>{selectedSlot}</strong>?
            </p>
            <div className="modalButtons">
              <button className="inputButton" onClick={confirmSubmit}>
                Tak, potwierdź
              </button>
              <button className="inputButton" onClick={() => setConfirming(false)}>
                Nie, wróć
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterTest;

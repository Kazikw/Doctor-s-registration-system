'use client';
import React, { useState } from 'react';
import './registerTest.css';
import { useRouter } from 'next/navigation';

function RegisterTest() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const categories = {
    'Badania laboratoryjne': ['Morfologia', 'Glukoza', 'Cholesterol', 'Elektrolity'],
    'Diagnostyka obrazowa': ['USG jamy brzusznej', 'RTG płuc', 'MRI'],
    'Badania funkcjonalne': ['EKG', 'Spirometria', 'Holter EKG'],
    'Endoskopia': ['Gastroskopia', 'Kolonoskopia'],
    'Profilaktyczne i przesiewowe': ['Cytologia', 'Mammografia', 'Badanie przesiewowe cukrzycy'],
    'Szczepienia': ['Grypa', 'COVID-19', 'HPV']
  };

  const slots = [
    { date: '2024-11-21', time: '09:00' },
    { date: '2024-11-22', time: '14:30' },
    { date: '2024-11-23', time: '10:00' },
  ];

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setAvailableTests(categories[category] || []);
    setSelectedTest('');
    setSelectedSlot(null);
  };

  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
    setSelectedSlot(null);
  };

  const isSubmitDisabled = !(selectedCategory && selectedTest && selectedSlot);

  const handleSubmit = () => {
    setConfirming(true); 
  };

  const confirmSubmit = () => {
    setConfirming(false); 
    alert(`Zapisano na badanie ${selectedTest} dnia ${selectedSlot.date} o godz. ${selectedSlot.time}.`);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <div className="mainContainer">
      <h1>Zapisz się na badanie</h1>

      {/* Formularz i przycisk "Zapisz się" umieszczony wewnątrz formWrapper */}
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
            <div className="calendarContainer">
              <h3>Dostępne terminy:</h3>
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`slot ${selectedSlot && selectedSlot.date === slot.date && selectedSlot.time === slot.time ? 'selected' : ''}`}
                  onClick={() => handleSlotClick(slot)}
                >
                  {slot.date} - {slot.time}
              </div>
          ))}

            </div>
          )}
        </div>

        {/* Wyśrodkowany przycisk "Zapisz się" na dole */}
        <button
          className={`submitButton ${isSubmitDisabled ? 'disabled' : 'enabled'}`}
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Zapisz się
        </button>
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
              Czy na pewno chcesz zapisać się na badanie <strong>{selectedTest}</strong> dnia <strong>{selectedSlot.date}</strong> o godzinie <strong>{selectedSlot.time}</strong>?
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

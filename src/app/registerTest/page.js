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
  const [hasReferral, setHasReferral] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [confirmationDetails, setConfirmationDetails] = useState(null); // Nowy stan na szczegóły potwierdzenia

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
    setHasReferral(null);
    setReferralCode('');
  };

  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
    setSelectedDate(null);
    setSelectedSlot('');
    setHasReferral(null);
    setReferralCode('');
  };

  const handleReferralChange = (e) => {
    setHasReferral(e.target.value === 'yes');
    setReferralCode('');
  };

  const handleReferralCodeChange = (e) => {
    const code = e.target.value;
    setReferralCode(code);
  };

  const isReferralCodeValid = referralCode.length === 4 && /^[0-9]+$/.test(referralCode);

  const clearFields = () => {
    setSelectedCategory('');
    setSelectedTest('');
    setAvailableTests([]);
    setSelectedDate(null);
    setSelectedSlot('');
    setConfirming(false);
    setHasReferral(null);
    setReferralCode('');
  };

  const confirmSubmit = () => {
    setConfirmationDetails({
      test: selectedTest,
      date: selectedDate.toLocaleDateString(),
      slot: selectedSlot,
    });
    setConfirming(false); // Zamknięcie modala potwierdzenia
  };

  const closeConfirmationModal = () => {
    setConfirmationDetails(null); // Czyszczenie szczegółów potwierdzenia
    clearFields(); // Czyszczenie formularza po kliknięciu "OK"
  };

  const isSubmitDisabled =
    !(selectedCategory && selectedTest && selectedDate && selectedSlot) ||
    (hasReferral && !isReferralCodeValid);

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
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            {availableTests.length > 0 && (
              <label>
                Wybierz rodzaj badania:
                <select value={selectedTest} onChange={handleTestChange}>
                  <option value="">-- Wybierz --</option>
                  {availableTests.map((test) => (
                    <option key={test} value={test}>
                      {test}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {selectedTest && (
            <>
              <div className="referralContainer">
                <h3>Czy posiadasz skierowanie na badanie?</h3>
                <div className="referralOptions">
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      checked={hasReferral === true}
                      onChange={handleReferralChange}
                    />
                    Tak
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="no"
                      checked={hasReferral === false}
                      onChange={handleReferralChange}
                    />
                    Nie
                  </label>
                </div>

                {hasReferral !== null && hasReferral && (
                  <label>
                    Wprowadź 4-cyfrowy kod skierowania:
                    <input
                      type="text"
                      value={referralCode}
                      onChange={handleReferralCodeChange}
                      maxLength="4"
                      className={isReferralCodeValid ? '' : 'error'}
                    />
                    {!isReferralCodeValid && referralCode.length > 0 && (
                      <p className="errorText">Nieprawidłowy kod skierowania!</p>
                    )}
                  </label>
                )}
              </div>

              {hasReferral !== null && (
                <div className="calendarContainer">
                  <h3>Wybierz datę:</h3>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    tileDisabled={tileDisabled}
                  />
                </div>
              )}

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
            onClick={() => setConfirming(true)}
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
              Czy na pewno chcesz zapisać się na badanie <strong>{selectedTest}</strong> dnia{' '}
              <strong>{selectedDate.toLocaleDateString()}</strong> o godzinie{' '}
              <strong>{selectedSlot}</strong>?
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

      {confirmationDetails && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Gratulacje!</h2>
            <p>
              Zostałeś/aś zapisany na badanie <strong>{confirmationDetails.test}</strong> w dniu{' '}
              <strong>{confirmationDetails.date}</strong> o godzinie <strong>{confirmationDetails.slot}</strong>.
            </p>
            <div className="modalButtons">
              <button className="inputButton" onClick={closeConfirmationModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterTest;

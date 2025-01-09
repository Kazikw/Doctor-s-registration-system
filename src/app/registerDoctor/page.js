'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './registerDoctor.css';
import { useRouter } from 'next/navigation';

function RegisterDoctor() {
  const router = useRouter();
  const navigateTo = (path) => () => router.push(path);

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [hasReferral, setHasReferral] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);

  const specializations = {
    "Lekarz rodzinny": ["Bartosz Kaszelek", "Katarzyna Śmigło", "Andrzej Tabletka", "Danuta Moneta"],
    "Pediatra": ["Damian Latarka", "Diana Deszczyk", "Marek Obrzęk", "Tamara Zdrówko"],
    "Ginekolog": ["Rafał Naleśnik", "Maria Wiosenka"],
    "Dermatolog": ["Lidia Kołderka", "Stanisław Oscypek"],
    "Kardiolog": ["Ksawery Kiełbasa", "Karolina Serducho"],
    "Ortopeda": ["Filip Kuternoga", "Cyprian Żeberko"],
    "Laryngolog": ["Dawid Bębenek", "Danuta Piskliwiec"],
    "Okulista": ["Olga Mętlik", "Wiesław Szkiełko"],
    "Neurolog": ["Marcin Samolot", "Alina Światowiec"],
    "Endokrynolog": ["Eryk Trofeum", "Beata Płanetnik"],
    "Reumatolog": ["Wiesław Kolano", "Bogusław Poganiacz"],
    "Psychiatra": ["Borys Wariat", "Teodozja Drapichrust"],
    "Chirurg": ["Tomasz Świeżak", "Eleonora Miał"],
    "Urolog": ["Janina Obraz", "Jan Krzesiwo"],
    "Dentysta": ["Aleksander Parzygęba", "Irena Ząbek"],
  };

  const slots = ['09:00', '10:30', '13:00', '15:00'];

  const prices = {
    "Lekarz rodzinny": 100,
    "Pediatra": 120,
    "Ginekolog": 150,
    "Dermatolog": 130,
    "Kardiolog": 200,
    "Ortopeda": 180,
    "Laryngolog": 110,
    "Okulista": 140,
    "Neurolog": 170,
    "Endokrynolog": 160,
    "Reumatolog": 140,
    "Psychiatra": 220,
    "Chirurg": 250,
    "Urolog": 180,
    "Dentysta": 90,
  };

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    setSelectedDoctor('');
    setSelectedDate(null);
    setSelectedSlot('');
    setHasReferral(null);
    setReferralCode('');
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
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
    setReferralCode(e.target.value);
  };

  const isReferralCodeValid = referralCode.length === 4 && /^[0-9]+$/.test(referralCode);

  const clearFields = () => {
    setSelectedSpecialization('');
    setSelectedDoctor('');
    setSelectedDate(null);
    setSelectedSlot('');
    setHasReferral(null);
    setReferralCode('');
    setConfirming(false);
  };

  const confirmSubmit = () => {
    setConfirmationDetails({
      doctor: selectedDoctor,
      date: selectedDate.toLocaleDateString(),
      slot: selectedSlot,
    });
    setConfirming(false);
  };

  const closeConfirmationModal = () => {
    setConfirmationDetails(null);
    clearFields();
  };

  const isSubmitDisabled =
    !(selectedSpecialization && selectedDoctor && selectedDate && selectedSlot);

  const tileDisabled = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; 
  };

  const showCalendar =
    hasReferral === false || (hasReferral === true && isReferralCodeValid);

  return (
    <div className="mainContainer">
      <h1>Zapisz się na wizytę</h1>
      <div className="formWrapper">
        <div className="formContainer">
          <div className="formFields">
            <label>
              Wybierz specjalizację:
              <select value={selectedSpecialization} onChange={handleSpecializationChange}>
                <option value="">-- Wybierz --</option>
                {Object.keys(specializations).map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </label>

            {selectedSpecialization && (
              <label>
                Wybierz lekarza:
                <select value={selectedDoctor} onChange={handleDoctorChange}>
                  <option value="">-- Wybierz --</option>
                  {specializations[selectedSpecialization].map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {selectedDoctor && (
            <div className="referralContainer">
              <h3>Czy posiadasz skierowanie na wizytę?</h3>
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

              {hasReferral === false && selectedSpecialization && (
                <div className="testPriceContainer">
                  <div className="testPriceNotice">
                    <h3>Cena wizyty:</h3>
                    <p>
                      <strong>{prices[selectedSpecialization]} PLN</strong>
                    </p>
                    <p>Pamiętaj, że za wizytę należy zapłacić.</p>
                  </div>
                </div>
                )}


              {hasReferral && (
                <div className="referralInputContainer">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={handleReferralCodeChange}
                    maxLength="4"
                    placeholder="Wprowadź 4-cyfrowy kod skierowania"
                    className={`referralCodeInput ${
                      isReferralCodeValid ? 'valid' : referralCode.length > 0 ? 'error' : ''
                    }`}
                  />
                  {!isReferralCodeValid && referralCode.length > 0 && (
                    <p className="referralCodeMessage error">Nieprawidłowy kod skierowania!</p>
                  )}
                  {isReferralCodeValid && (
                    <p className="referralCodeMessage valid">✓ Kod poprawny!</p>
                  )}
                </div>
              )}
            </div>
          )}

          {showCalendar && (
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
              {slots.map((slot) => (
                <div
                  key={slot}
                  className={`slot ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          )}

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
              Czy na pewno chcesz zapisać się na wizytę do <strong>{selectedDoctor}</strong> dnia{' '}
              <strong>{selectedDate?.toLocaleDateString()}</strong> o godzinie{' '}
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
              Zostałeś/aś zapisany/a na wizytę u <strong>{confirmationDetails.doctor}</strong> w dniu{' '}
              <strong>{confirmationDetails.date}</strong> o godzinie <strong>{confirmationDetails.slot}</strong>.
            </p>
            <div className="modalButtons">
              <button className="inputButton" onClick={() => router.push('/dashboard')}>
                Wróć do panelu głównego
              </button>
              <button className="inputButton" onClick={closeConfirmationModal}>
                Zapisz na kolejną wizytę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterDoctor;

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const calendarFace = document.querySelector('#datetime-picker');

const startBtn = document.querySelector('button[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minElement = document.querySelector('[data-minutes]');
const secElement = document.querySelector('[data-seconds]');

let userSelectedTime = null;
let intervalId = null;

function updateTimer() {
  const currentTime = Date.now();
  const deltaTime = userSelectedTime - currentTime;

  if (deltaTime <= 0) {
    clearInterval(intervalId);
    daysElement.textContent = '00';
    hoursElement.textContent = '00';
    minElement.textContent = '00';
    secElement.textContent = '00';
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(deltaTime);

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minElement.textContent = addLeadingZero(minutes);
  secElement.textContent = addLeadingZero(seconds);
}

function startTimer() {
  if (!userSelectedTime) return;

  const currentTime = Date.now();
  if (userSelectedTime <= currentTime) {
    iziToast.error({ message: 'Please choose a date in the future' });
    return;
  }

  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedTime = selectedDates[0].getTime();
    console.log(selectedDates[0]);
  },
};

flatpickr(calendarFace, options);

startBtn.addEventListener('click', startTimer);

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
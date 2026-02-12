import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const timer = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

timer.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];
    if (!date || date <= new Date()) {
      userSelectedDate = null;
      timer.startBtn.disabled = true;
      iziToast.error({
        title: '',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 2500,
        close: false,
        backgroundColor: '#f56565',
        messageColor: '#fff',
        titleColor: '#fff',
        icon: 'ico-error',
        iconColor: '#fff',
        progressBar: false,
        layout: 2,
        maxWidth: 340,
      });
      return;
    }
    userSelectedDate = date;
    timer.startBtn.disabled = false;
  },
};

flatpickr(timer.input, options);

timer.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  timer.startBtn.disabled = true;
  timer.input.disabled = true;
  updateClock();
  timerId = setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const diff = userSelectedDate - now;

  if (diff <= 0) {
    clearInterval(timerId);
    timerId = null;
    renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    timer.input.disabled = false;
    userSelectedDate = null;
    return;
  }

  const timeParts = convertMs(diff);
  renderTime(timeParts);
}

function renderTime({ days, hours, minutes, seconds }) {
  timer.days.textContent = addLeadingZero(days);
  timer.hours.textContent = addLeadingZero(hours);
  timer.minutes.textContent = addLeadingZero(minutes);
  timer.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
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

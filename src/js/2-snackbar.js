import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.snackbar-form');
const delayInput = form?.elements.delay;
const stateInputs = form?.elements.state;

form?.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const delay = Number(delayInput.value);
  const state = stateInputs.value;

  if (Number.isNaN(delay) || delay < 0 || !state) {
    iziToast.warning({
      message: 'Enter non-negative delay and choose state',
      position: 'topRight',
    });
    return;
  }

  createPromise(delay, state)
    .then(value => {
      console.log(`✅ Fulfilled promise in ${value}ms`);
      iziToast.success({
        message: `✅ Fulfilled promise in ${value}ms`,
        position: 'topRight',
        timeout: 4000,
        progressBar: false,
        class: 'toast-success',
        maxWidth: 420,
      });
    })
    .catch(value => {
      console.log(`❌ Rejected promise in ${value}ms`);
      iziToast.error({
        message: `❌ Rejected promise in ${value}ms`,
        position: 'topRight',
        timeout: 4000,
        progressBar: false,
        class: 'toast-error',
        maxWidth: 420,
      });
    });
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });
}

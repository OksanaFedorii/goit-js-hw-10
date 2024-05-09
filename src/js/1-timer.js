import "flatpickr/dist/flatpickr.min.css";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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
    return value.toString().padStart(2, '0');
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose: function(selectedDates) {
        const selectedDate = selectedDates[0];
        handleDateSelection(selectedDate);
    }
};

flatpickr("#datetime-picker", options);

let userSelectedDate = null;

function handleDateSelection(date) {
    const now = new Date();
    const startButton = document.querySelector('button[data-start]');
    const datetimePicker = document.querySelector('#datetime-picker');

    if (date <= now) {
        iziToast.error({
            title: 'Error',
            message: `❌ Plase choose a data in the future`,
            position: 'topRight',
            timeout: 5000
        });
        startButton.disabled = true;
    } else {
        startButton.disabled = false;
        userSelectedDate = date; 
    }
}

document.querySelector('button[data-start]').addEventListener('click', function() {
    const datetimePicker = document.querySelector('#datetime-picker');
    if (userSelectedDate > new Date()) {
        this.disabled = true; 
        datetimePicker.disabled = true; 
        startTimer(userSelectedDate);
    }
});

function startTimer(endTime) {
    const timerInterval = setInterval(function() {
        const now = new Date();
        const timeLeft = endTime - now;

        if (timeLeft >= 0) {
            const { days, hours, minutes, seconds } = convertMs(timeLeft);
            document.querySelector('[data-days]').textContent = addLeadingZero(days);
            document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
            document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
            document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
        } else {
            clearInterval(timerInterval);
            iziToast.info({
                title: 'Time',
                message: "Time's up!",
                position: 'topCenter'
            });
            document.querySelector('#datetime-picker').disabled = false; 
            document.querySelector('button[data-start]').disabled = true; 
        }
    }, 1000);
}



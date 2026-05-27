// === КАСТОМНЫЙ ЦИФЕРБЛАТ ===
let currentHour = 14;
let currentMinute = 0;

function updateTimeDisplay() {
    const hourElem = document.getElementById('hourDisplay');
    const minElem = document.getElementById('minDisplay');
    if (hourElem) hourElem.textContent = currentHour.toString().padStart(2, '0');
    if (minElem) minElem.textContent = currentMinute.toString().padStart(2, '0');
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    updateTotalWithTime(timeString);
}

const hourUp = document.getElementById('hourUp');
const hourDown = document.getElementById('hourDown');
const minUp = document.getElementById('minUp');
const minDown = document.getElementById('minDown');

if (hourUp) hourUp.addEventListener('click', () => { currentHour = (currentHour + 1) % 24; updateTimeDisplay(); });
if (hourDown) hourDown.addEventListener('click', () => { currentHour = (currentHour - 1 + 24) % 24; updateTimeDisplay(); });
if (minUp) minUp.addEventListener('click', () => { currentMinute = (currentMinute + 15) % 60; updateTimeDisplay(); });
if (minDown) minDown.addEventListener('click', () => { currentMinute = (currentMinute - 15 + 60) % 60; updateTimeDisplay(); });

// === КАЛЬКУЛЯТОР ===
function getDiscountPercent(timeString) {
    if (!timeString) return 0;
    let hours = parseInt(timeString.split(':')[0]);
    let minutes = parseInt(timeString.split(':')[1]);
    let timeInHours = hours + minutes / 60;
    if (timeInHours >= 22 || timeInHours < 6) return 20;
    if (timeInHours >= 12 && timeInHours < 18) return 10;
    return 0;
}

function getDiscountMessage(percent) {
    if (percent === 20) return '<i class="fas fa-moon"></i> Ночная скидка 20% (с 22:00 до 06:00)';
    if (percent === 10) return '<i class="fas fa-sun"></i> Дневная скидка 10% (с 12:00 до 18:00)';
    return '<i class="fas fa-clock"></i> Стандартный тариф (без скидки)';
}

const tariffSelect = document.getElementById('tariffSelect');
const hoursCalc = document.getElementById('hoursCalc');
const totalSpan = document.getElementById('totalPrice');
const discountMsg = document.getElementById('discountMessage');

function updateTotalWithTime(timeString) {
    if (!tariffSelect || !hoursCalc || !totalSpan) return;
    let price = parseFloat(tariffSelect.value);
    let hours = parseFloat(hoursCalc.value);
    if (isNaN(hours) || hours <= 0) hours = 1;
    let discount = getDiscountPercent(timeString) / 100;
    let total = price * hours * (1 - discount);
    totalSpan.innerText = Math.round(total) + ' ₽';
    if (discountMsg) discountMsg.innerHTML = getDiscountMessage(getDiscountPercent(timeString));
}

function updateTotal() {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    updateTotalWithTime(timeString);
}

if (tariffSelect) tariffSelect.addEventListener('change', updateTotal);
if (hoursCalc) hoursCalc.addEventListener('input', updateTotal);
updateTotal();

// === ФОРМА ЗАПИСИ ===
const submitBtn = document.getElementById('submitBookingBtn');
const statusDiv = document.getElementById('bookingStatus');

if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const name = document.getElementById('bookingName')?.value.trim() || '';
        const phone = document.getElementById('bookingPhone')?.value.trim() || '';
        const tariff = document.getElementById('bookingTariff')?.value || '';
        const date = document.getElementById('bookingDate')?.value || '';
        const time = document.getElementById('bookingTime')?.value || '';
        let hours = parseFloat(document.getElementById('bookingHours')?.value || 0);

        if (!name || !phone || !date || !time || isNaN(hours)) {
            if (statusDiv) {
                statusDiv.textContent = '❌ Заполните все поля: Имя, Телефон, Дата, Время, Часы';
                statusDiv.className = 'booking-status error';
                setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none'; }, 3000);
            }
            return;
        }
        if (hours < 2) {
            if (statusDiv) {
                statusDiv.textContent = '❌ Ошибка: онлайн-запись от 2 часов и более! Вы выбрали ' + hours + ' ч.';
                statusDiv.className = 'booking-status error';
                setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none'; }, 4000);
            }
            return;
        }

        if (statusDiv) {
            statusDiv.textContent = `✅ ${name}, заявка принята! Тариф: ${tariff} | ${date} в ${time} на ${hours} ч. Скоро свяжемся с вами.`;
            statusDiv.className = 'booking-status success';
            setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none'; }, 5000);
        }
    });
}

// Подстановка дат
const bookingDate = document.getElementById('bookingDate');
const bookingTime = document.getElementById('bookingTime');
const bookingHours = document.getElementById('bookingHours');

if (bookingDate) {
    const today = new Date().toISOString().split('T')[0];
    bookingDate.min = today;
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookingDate.value = tomorrow.toISOString().split('T')[0];
}
if (bookingTime) bookingTime.value = '18:00';
if (bookingHours) {
    bookingHours.min = 2;
    bookingHours.value = 2;
}
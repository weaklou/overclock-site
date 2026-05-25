// === КАСТОМНЫЙ ЦИФЕРБЛАТ ===
let currentHour = 14;
let currentMinute = 0;

function updateTimeDisplay() {
    document.getElementById('hourDisplay').textContent = currentHour.toString().padStart(2, '0');
    document.getElementById('minDisplay').textContent = currentMinute.toString().padStart(2, '0');
    // Формируем строку времени для калькулятора
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    // Вызываем пересчёт цены, передавая новое время
    updateTotalWithTime(timeString);
}

// Управление часами
document.getElementById('hourUp').addEventListener('click', () => {
    currentHour = (currentHour + 1) % 24;
    updateTimeDisplay();
});
document.getElementById('hourDown').addEventListener('click', () => {
    currentHour = (currentHour - 1 + 24) % 24;
    updateTimeDisplay();
});
// Управление минутами (шаг 15 минут для удобства)
document.getElementById('minUp').addEventListener('click', () => {
    currentMinute = (currentMinute + 15) % 60;
    updateTimeDisplay();
});
document.getElementById('minDown').addEventListener('click', () => {
    currentMinute = (currentMinute - 15 + 60) % 60;
    updateTimeDisplay();
});

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
    let price = parseFloat(tariffSelect.value);
    let hours = parseFloat(hoursCalc.value);
    if (isNaN(hours) || hours <= 0) hours = 1;
    let discount = getDiscountPercent(timeString) / 100;
    let total = price * hours * (1 - discount);
    totalSpan.innerText = Math.round(total) + ' ₽';
    discountMsg.innerHTML = getDiscountMessage(getDiscountPercent(timeString));
}

function updateTotal() {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    updateTotalWithTime(timeString);
}

tariffSelect.addEventListener('change', updateTotal);
hoursCalc.addEventListener('input', updateTotal);
updateTotal();

// === ФОРМА ЗАПИСИ ===
const submitBtn = document.getElementById('submitBookingBtn');
const statusDiv = document.getElementById('bookingStatus');

submitBtn.addEventListener('click', () => {
    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const tariff = document.getElementById('bookingTariff').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    let hours = parseFloat(document.getElementById('bookingHours').value);

    if (!name || !phone || !date || !time || isNaN(hours)) {
        statusDiv.textContent = '❌ Заполните все поля: Имя, Телефон, Дата, Время, Часы';
        statusDiv.className = 'booking-status error';
        setTimeout(() => statusDiv.style.display = 'none', 3000);
        return;
    }
    if (hours < 2) {
        statusDiv.textContent = '❌ Ошибка: онлайн-запись от 2 часов и более! Вы выбрали ' + hours + ' ч.';
        statusDiv.className = 'booking-status error';
        setTimeout(() => statusDiv.style.display = 'none', 4000);
        return;
    }

    statusDiv.textContent = `✅ ${name}, заявка принята! Тариф: ${tariff} | ${date} в ${time} на ${hours} ч. Скоро свяжемся с вами.`;
    statusDiv.className = 'booking-status success';
    setTimeout(() => statusDiv.style.display = 'none', 5000);
});

// Подстановка дат
const today = new Date().toISOString().split('T')[0];
document.getElementById('bookingDate').min = today;
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('bookingDate').value = tomorrow.toISOString().split('T')[0];
document.getElementById('bookingTime').value = '18:00';
document.getElementById('bookingHours').min = 2;
document.getElementById('bookingHours').value = 2;
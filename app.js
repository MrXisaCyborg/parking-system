const users = [];
let currentUser = null;
const bookings = [];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function registerUser(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  if(users.find(u => u.email === email)) {
    alert('Email already registered');
    return;
  }
  users.push({name, email, password});
  alert('Registration successful! Please login.');
  showScreen('login');
}

function loginUser(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  const user = users.find(u => u.email === email && u.password === password);
  if(!user) {
    alert('Invalid email or password');
    return;
  }
  currentUser = user;
  showScreen('dashboard');
  renderBookings();
}

function logout() {
  currentUser = null;
  showScreen('welcome');
}

function submitBooking(event) {
  event.preventDefault();
  if(!currentUser) {
    alert('Please log in first.');
    showScreen('login');
    return;
  }

  const form = event.target;
  const mobileNumber = form.mobileNumber.value.trim();
  const parkingLot = form.parkingLot.value;
  const vehicleNumber = form.vehicleNumber.value.trim();
  const vehicleType = form.vehicleType.value;
  const startTime = form.startTime.value;
  const duration = form.duration.value;

  if(!/^\d{10}$/.test(mobileNumber)) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  const booking = {
    id: bookings.length + 1,
    userEmail: currentUser.email,
    mobileNumber,
    parkingLot,
    vehicleNumber,
    vehicleType,
    startTime,
    duration
  };

  bookings.push(booking);

  alert('Booking successful!');
  showBookingConfirmation(booking);
  renderBookings();
}

function showBookingConfirmation(booking) {
  showScreen('confirmation');
  const details = document.getElementById('bookingDetails');
  details.innerHTML = `
    <p><strong>Parking Lot:</strong> ${booking.parkingLot}</p>
    <p><strong>Vehicle Number:</strong> ${booking.vehicleNumber} (${booking.vehicleType})</p>
    <p><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
    <p><strong>Duration:</strong> ${booking.duration} hours</p>
  `;
  document.getElementById('bookingCode').textContent = booking.mobileNumber;
}

function copyBookingCode() {
  const code = document.getElementById('bookingCode').textContent;
  navigator.clipboard.writeText(code).then(() => alert('Booking code copied!'));
}

function renderBookings() {
  const container = document.getElementById('bookingsList');
  container.innerHTML = '';

  const userBookings = bookings.filter(b => b.userEmail === currentUser.email);

  if(userBookings.length === 0) {
    container.innerHTML = '<p>No bookings found.</p>';
    return;
  }

  userBookings.forEach(booking => {
    const card = document.createElement('div');
    card.className = 'parkingCard fade-in';
    card.innerHTML = `
      <h4>${booking.parkingLot}</h4>
      <p><strong>Vehicle:</strong> ${booking.vehicleNumber}</p>
      <p><strong>Start:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
      <p><strong>Duration:</strong> ${booking.duration} hours</p>
      <p><strong>Booking Code (Mobile):</strong> <span class="booking-code">${booking.mobileNumber}</span> <button class="btn btn-copy" onclick="copyCode('${booking.mobileNumber}')">Copy</button></p>
    `;
    container.appendChild(card);
  });
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => alert('Booking code copied!'));
}

document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('bookingForm').addEventListener('submit', submitBooking);

showScreen('welcome');




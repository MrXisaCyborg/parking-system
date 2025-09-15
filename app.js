const users = [];
let currentUser = null;
let currentBooking = null;
let bookings = [];

const parkingLots = [
  {id:1,name: "Downtown Mall",available:45,total:200,rate:5},
  {id:2,name: "Airport Parking",available:120,total:500,rate:3},
  {id:3,name: "City Center",available:8,total:150,rate:8},
  {id:4,name: "Stadium",available:300,total:800,rate:4}
];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id === 'dashboard') loadParkingLots();
  else if(id === 'myBookings') renderBookings();
}

function registerUser(event) {
  event.preventDefault();
  const f = event.target;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const pass = f.password.value.trim();
  if(users.find(u=>u.email===email)) return alert('Email already registered');
  users.push({name,email,pass});
  alert('Registered successfully. Please login.');
  showScreen('login');
}

function loginUser(event) {
  event.preventDefault();
  const f = event.target;
  const email = f.email.value.trim();
  const pass = f.password.value.trim();
  const user = users.find(u=>u.email===email && u.pass===pass);
  if(!user) return alert('Invalid credentials');
  currentUser = user;
  showScreen('dashboard');
}

function logout(){
  currentUser=null;
  currentBooking=null;
  showScreen('welcome');
}

function loadParkingLots() {
  const container = document.getElementById('parkingGrid');
  container.innerHTML = '';
  parkingLots.forEach(lot=>{
    const div = document.createElement('div');
    div.className = 'parkingCard';
    div.innerHTML = `
      <h3>${lot.name}</h3>
      <p>Available: ${lot.available}/${lot.total}</p>
      <p>Hourly Rate: $${lot.rate}</p>
      <button onclick="startBooking(${lot.id})"${lot.available===0?' disabled':''}>Book Now</button>
    `;
    container.appendChild(div);
  });
}

function startBooking(lotId) {
  currentBooking = {...parkingLots.find(l=>l.id===lotId)};
  document.getElementById('selectedLot').innerText = currentBooking.name + ' - $' + currentBooking.rate + '/hour';
  const f = document.getElementById('bookingForm');
  f.reset();
  f.startTime.value = new Date().toISOString().slice(0,16);
  updateCost();
  showScreen('booking');
}

function updateCost() {
  const duration = +document.getElementById('duration').value;
  if(!currentBooking) return;
  const cost = currentBooking.rate * duration;
  document.getElementById('costCalc').innerText = Total Cost: $${cost.toFixed(2)};
}

document.getElementById('duration').addEventListener('change', updateCost);

function submitBooking(event){
  event.preventDefault();
  if(!currentUser) return alert('Please login first');
  const f = event.target;
  const vehicleNumber = f.vehicleNumber.value.trim();
  const vehicleType = f.vehicleType.value;
  const startTime = f.startTime.value;
  const duration = +f.duration.value;
  
  // Generate unique 8-digit booking code
  const bookingCode = generateBookingCode();

  const booking = {
    id: bookings.length + 1,
    userEmail: currentUser.email,
    lotName: currentBooking.name,
    vehicleNumber,
    vehicleType,
    startTime,
    duration,
    cost: currentBooking.rate * duration,
    bookingCode
  };
  bookings.push(booking);

  alert('Booking successful!');
  showBookingConfirmation(booking);
  currentBooking.available--; // reduce availability
}

function generateBookingCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for(let i=0; i<8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function showBookingConfirmation(booking){
  showScreen('confirmation');
  const details = document.getElementById('bookingDetails');
  details.innerHTML = `
    <p>Parking Lot: ${booking.lotName}</p>
    <p>Vehicle: ${booking.vehicleNumber} (${booking.vehicleType})</p>
    <p>Start Time: ${new Date(booking.startTime).toLocaleString()}</p>
    <p>Duration: ${booking.duration} hours</p>
    <p>Cost Paid: $${booking.cost.toFixed(2)}</p>
  `;
  document.getElementById('bookingCode').innerText = booking.bookingCode;
}

function copyBookingCode(){
  const code = document.getElementById('bookingCode').innerText;
  navigator.clipboard.writeText(code).then(() => alert('Booking code copied!'));
}

function renderBookings(){
  showScreen('myBookings');
  const list = document.getElementById('bookingsList');
  list.innerHTML = '';
  bookings.filter(b=>b.userEmail===currentUser.email).forEach(b=>{
    const div = document.createElement('div');
    div.className = 'parkingCard';
    div.innerHTML = `
      <h4>${b.lotName}</h4>
      <p>Vehicle: ${b.vehicleNumber}</p>
      <p>Start: ${new Date(b.startTime).toLocaleString()}</p>
      <p>Duration: ${b.duration} hours</p>
      <p>Booking Code: <strong>${b.bookingCode}</strong> <button onclick="copyCode('${b.bookingCode}')">Copy</button></p>
    `;
    list.appendChild(div);
  });
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => alert('Booking code copied!'));
}

document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('bookingForm').addEventListener('submit', submitBooking);
document.getElementById('duration').addEventListener('change', updateCost);

showScreen('welcome');

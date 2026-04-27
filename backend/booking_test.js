const fetch = globalThis.fetch;

async function run() {
  const email = 'testuser@example.com';
  const password = 'Test1234!';
  let token;

  try {
    let res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.status === 401) {
      console.log('User not found, registering...');
      await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email, password })
      });
      res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    }
    const loginBody = await res.json();
    console.log('login status', res.status, loginBody);
    token = loginBody.token;
    if (!token) {
      console.error('No token returned');
      return;
    }
  } catch (err) {
    console.error('Login error', err);
    return;
  }

  try {
    const bookingData = {
      hotel: {
        name: 'Trident Nariman Point',
        city: 'Mumbai',
        location: 'Nariman Point',
        imageUrl: 'https://example.com/image.jpg',
        price: 12000,
        rating: 4.8
      },
      checkInDate: '2026-05-01',
      checkOutDate: '2026-05-02',
      guests: 1,
      totalPrice: 12000
    };
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    const body = await res.text();
    console.log('booking status', res.status, body);
  } catch (err) {
    console.error('Booking request failed', err);
  }
}

run();
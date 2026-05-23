const axios = require('axios');

async function testPost() {
  try {
    const res = await axios.post('http://localhost:5001/api/messages', {
      name: 'Test',
      email: 'test@test.com',
      subject: 'Test subject',
      message: 'Test message'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error occurred:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    }
  }
}

testPost();

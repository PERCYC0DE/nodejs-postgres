const jwt = require('jsonwebtoken');

const secret = 'mysecret';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY2ODk1NzI5MX0.4lHzHQ7hKcbZCdrZVlTzBN1xMLhoOxBbRujWa-IIJ4c';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);

// eslint-disable-next-line no-console
console.log(payload);

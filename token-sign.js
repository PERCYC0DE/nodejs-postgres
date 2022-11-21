const jwt = require('jsonwebtoken');

const secret = 'mysecret';

// Tiempo de expiración
const jwtConfig = {
  expiresIn: '7d',
};

// Que vamos a encriptar
const payload = {
  sub: 1, // Identificador
  role: 'customer',
};

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret, jwtConfig);
// eslint-disable-next-line no-console
console.log(token);

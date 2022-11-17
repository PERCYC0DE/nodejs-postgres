const bcrypt = require('bcrypt');

async function verifyPassword() {
  const myPassword = 'admin123';
  const hash = '$2b$10$3tomwj1QmxGq4ja3AmPHUu0q51yVqpSogCOIv4QrN.DVVER1uK4/S';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
}

verifyPassword();

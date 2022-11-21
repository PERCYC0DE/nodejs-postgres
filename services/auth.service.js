const UserService = require('./user.service');
const service = new UserService();
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const nodemailer = require('nodemailer');

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) throw boom.unauthorized();

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw boom.unauthorized();

    // If all its ok
    // but before remove password
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }
  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) throw boom.unauthorized();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'ppj.code@gmail.com',
        pass: 'frujkzwpudldfchu',
      },
    });
    await transporter.sendMail({
      from: 'ppj.code@gmail.com', // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Mensaje de Prueba', // Subject line
      text: 'Este es un mensaje de prueba desde un servidor ftp', // plain text body
      html: '<b>Mensaje de Prueba</b>', // html body
    });
    return {
      message: 'Mail sent',
    };
  }
}

module.exports = AuthService;

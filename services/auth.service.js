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
    delete user.dataValues.recoveryToken;
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

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) throw boom.unauthorized();

    // Generar payload
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `https://myfrontend.com/recovery?token=${token}`;

    // Guardar el token en la base de datos
    await service.update(user.id, { recoveryToken: token });

    const mail = {
      from: 'ppj.code@gmail.com', // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Email para recuperar tu contraseña', // Subject line
      html: `<b>Ingresa a este link: ${link}</b>`, // html body
    };
    const response = await this.sendMail(mail);
    return response;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) throw boom.unauthorized();

      // Hashear la nueva contraseña
      const hash = await bcrypt.hash(newPassword, 10);

      await service.update(user.id, { recoveryToken: null, password: hash });

      return { message: 'Password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    // const user = await service.findByEmail(email);
    // if (!user) throw boom.unauthorized();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.smptUser,
        pass: config.smptPassword,
      },
    });
    await transporter.sendMail(infoMail);
    return {
      message: 'Mail sent',
    };
  }
}

module.exports = AuthService;

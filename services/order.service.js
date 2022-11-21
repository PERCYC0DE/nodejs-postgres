const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class OrderService {
  constructor() {}

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async findbyUser(userId) {
    const orders = await models.Order.findAll({
      where: {
        '$customer.user.id$': userId, // Consultar por las asociaciones
      },
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
      ],
    });
    return orders;
  }

  //TODO:implement this feature
  async find() {
    const orders = await models.Order.findAll();
    if (!orders) throw boom.notFound('Orders Not Found');
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });
    if (!order) {
      throw boom.notFound('Order Not Found');
    }
    return order;
  }

  //TODO:How i can updat one order if this have other elements into her schema?
  async update(id, changes) {
    const order = await this.findOne(id);
    const response = await order.update(changes);
    return response;
  }

  //TODO:Need delete one order and and delete her items
  async delete(id) {
    return { id };
  }
}

module.exports = OrderService;

import sequelize from '../config/database';
import User from './User';
import Product from './Product';
import Order from './Order';
import OrderProduct from './OrderProduct';

// Relaciones
User.hasMany(Order, {foreignKey: 'userId', as: 'orders'});
Order.belongsTo(User, {foreignKey: 'userId', as: 'user'});

Order.belongsToMany(Product, {through: OrderProduct, as: 'products', foreignKey: 'orderId'});
Product.belongsToMany(Order, {through: OrderProduct, as: 'orders', foreignKey: 'productId'});

// Exportamos para usar en servicios
export {sequelize, User, Product, Order, OrderProduct};
import sequelize from '../config/database';
import User from './User';
import Product from './Product';
import Order from './Order';
import OrderProduct from './OrderProduct';

// ✅ Relaciones corregidas y compatibles con tu SQL
User.hasMany(Order, {foreignKey: 'user_id', as: 'orders'});
Order.belongsTo(User, {foreignKey: 'user_id', as: 'user'});

Order.belongsToMany(Product, {
    through: OrderProduct,
    as: 'products',
    foreignKey: 'order_id',      // ✅ nombre real de la columna
    otherKey: 'product_id'       // ✅ necesario para N:M
});

Product.belongsToMany(Order, {
    through: OrderProduct,
    as: 'orders',
    foreignKey: 'product_id',
    otherKey: 'order_id'
});

// Exportamos para usar en servicios
export {sequelize, User, Product, Order, OrderProduct};
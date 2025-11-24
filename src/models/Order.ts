// Modelo Order: id, date, status, userId
import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Product from './Product';
import OrderProduct from './OrderProduct';

interface OrderAttributes {
    id: number;
    date: Date;
    status: 'pending' | 'preparing' | 'delivered' | undefined;
    userId: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'date'> {
}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public date!: Date;
    public status!: 'pending' | 'preparing' | 'delivered';
    public userId!: number;
    public readonly products?: (Product & { OrderProduct: OrderProduct })[];
}

Order.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
        status: {type: DataTypes.ENUM('pending', 'preparing', 'delivered'), allowNull: false, defaultValue: 'pending'},
        userId: {type: DataTypes.INTEGER, allowNull: false, references: {model: User, key: 'id'}}
    },
    {sequelize, tableName: 'orders'}
);

export default Order;
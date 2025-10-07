// Tabla intermedia OrderProduct: relacion N:M con quantity y unitPrice
import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database';

class OrderProduct extends Model {
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public unitPrice!: number;
}

OrderProduct.init(
    {
        orderId: {type: DataTypes.INTEGER, primaryKey: true},
        productId: {type: DataTypes.INTEGER, primaryKey: true},
        quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
        unitPrice: {type: DataTypes.DECIMAL(10, 2), allowNull: false}
    },
    {sequelize, tableName: 'order_products', timestamps: false}
);

export default OrderProduct;
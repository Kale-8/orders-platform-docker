// Modelo Product: id, name, price, category
import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
    id: number;
    name: string;
    price: number;
    category: string | undefined;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {
}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public category!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        name: {type: DataTypes.STRING, allowNull: false},
        price: {type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0},
        category: {type: DataTypes.STRING, allowNull: true}
    },
    {sequelize, tableName: 'products'}
);

export default Product;
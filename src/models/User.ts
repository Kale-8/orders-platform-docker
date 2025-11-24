// Modelo User: id, name, email, role (admin|client)
import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'client' | undefined;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public role!: 'admin' | 'client';
}

User.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        name: {type: DataTypes.STRING, allowNull: false},
        email: {type: DataTypes.STRING, allowNull: false, unique: true},
        role: {type: DataTypes.ENUM('admin', 'client'), allowNull: false, defaultValue: 'client'}
    },
    {sequelize, tableName: 'users'}
);

export default User;
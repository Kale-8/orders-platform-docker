// Configuración de Sequelize - si NODE_ENV=test usamos sqlite in-memory para tests
import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = isTest
    ? new Sequelize('sqlite::memory:', {logging: false}) // sqlite para tests
    : new Sequelize(
        process.env.DB_NAME as string,
        process.env.DB_USER as string,
        process.env.DB_PASS as string,
        {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            dialect: 'postgres',
            logging: false,
            define: {
                underscored: true,
                timestamps: false
            },
        }
    );

export default sequelize;
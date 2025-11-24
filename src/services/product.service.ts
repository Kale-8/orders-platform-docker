import {Product} from '../models';
import {Op} from 'sequelize';

export async function createProduct(payload: { name: string; price: number; category?: string }) {
    return Product.create(payload);
}

export async function findProductsByCategory(category?: string) {
    if (!category) return Product.findAll();
    return Product.findAll({where: {category: {[Op.like]: `%${category}%`}}});
}

export async function listProducts() {
    return Product.findAll();
}
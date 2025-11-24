// Controladores para productos (create / list)
import {Request, Response} from 'express';
import * as productService from '../services/product.service';

export async function createProductHandler(req: Request, res: Response) {
    try {
        // Validación básica: name y price son requeridos
        const {name, price, category} = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({message: 'name and price are required'});
        }

        const product = await productService.createProduct({name, price, category});
        return res.status(201).json(product);
    } catch (err: any) {
        console.error('createProductHandler error:', err);
        return res.status(500).json({message: err.message || 'Internal server error'});
    }
}

export async function listProductsHandler(req: Request, res: Response) {
    try {
        // Soportamos query param ?category=beverages
        const category = typeof req.query.category === 'string' ? req.query.category : undefined;

        // Si llega category usamos findProductsByCategory, si no usamos listProducts (ambos del service)
        const products = category
            ? await productService.findProductsByCategory(category)
            : await productService.listProducts();

        return res.json(products);
    } catch (err: any) {
        console.error('listProductsHandler error:', err);
        return res.status(500).json({message: err.message || 'Internal server error'});
    }
}
// Controladores para Orders: create, get (con total) y list con filtros
import {Request, Response} from 'express';
import * as orderService from '../services/order.service';
import {Op} from 'sequelize';

type OrderProductInput = { productId: number; quantity: number };

export async function createOrderHandler(req: Request, res: Response) {
    try {
        // Validación básica del body
        const {userId, products} = req.body as { userId?: number; products?: OrderProductInput[] };
        if (!userId || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({message: 'userId and non-empty products array are required'});
        }

        // Llamamos al servicio que crea la orden en una transacción
        const order = await orderService.createOrder(Number(userId), products);
        // Para devolver datos completos (incluyendo total y productos) consultamos getOrderWithTotal
        const result = await orderService.getOrderWithTotal(order.id);
        return res.status(201).json(result);
    } catch (err: any) {
        console.error('createOrderHandler error:', err);
        if (err.message && err.message.startsWith('Product')) {
            return res.status(404).json({message: err.message});
        }
        return res.status(500).json({message: err.message || 'Internal server error'});
    }
}

export async function getOrderHandler(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({message: 'Invalid order id'});

        const result = await orderService.getOrderWithTotal(id);
        if (!result) return res.status(404).json({message: 'Order not found'});

        return res.json(result);
    } catch (err: any) {
        console.error('getOrderHandler error:', err);
        return res.status(500).json({message: err.message || 'Internal server error'});
    }
}

/**
 * listOrdersHandler:
 * Soporta filtros por query string:
 *  - ?status=pending,preparing    (comma-separated)
 *  - ?afterDate=2025-10-01        (ISO date string)
 *
 * Usa las funciones de service:
 *  - filterOrdersByStatus(statuses: string[])
 *  - filterOrdersByDate(afterDate: Date)
 *  - getOrderWithTotal(orderId: number)  (para incluir productos y total)
 *
 * Si no llegan filtros, devuelve todas las órdenes usando filterOrdersByDate con fecha epoch (dev).
 */
export async function listOrdersHandler(req: Request, res: Response) {
    try {
        const statusQ = typeof req.query.status === 'string' ? req.query.status : undefined;
        const afterDateQ = typeof req.query.afterDate === 'string' ? req.query.afterDate : undefined;

        let orders: any[] = [];

        // Caso: ambos filtros
        if (statusQ && afterDateQ) {
            const statuses = statusQ.split(',').map((s) => s.trim()).filter(Boolean);
            const after = new Date(afterDateQ);
            if (isNaN(after.getTime())) {
                return res.status(400).json({message: 'Invalid afterDate format. Use YYYY-MM-DD or ISO date.'});
            }

            // Usamos service para filtrar por status y luego filtramos por fecha en memoria
            const ordersByStatus = await orderService.filterOrdersByStatus(statuses);
            orders = (ordersByStatus || []).filter((o: any) => new Date(o.date) > after);
        }
        // Solo status
        else if (statusQ) {
            const statuses = statusQ.split(',').map((s) => s.trim()).filter(Boolean);
            orders = await orderService.filterOrdersByStatus(statuses);
        }
        // Solo afterDate
        else if (afterDateQ) {
            const after = new Date(afterDateQ);
            if (isNaN(after.getTime())) {
                return res.status(400).json({message: 'Invalid afterDate format. Use YYYY-MM-DD or ISO date.'});
            }
            orders = await orderService.filterOrdersByDate(after);
        }
        // Sin filtros -> devolvemos todas las órdenes (para no acceder directamente al modelo usamos filterOrdersByDate con epoch)
        else {
            orders = await orderService.filterOrdersByDate(new Date(0)); // todas las órdenes con date > 1970-01-01
        }

        // Para cada orden obtenemos sus productos y calculamos total usando getOrderWithTotal (servicio reutilizable)
        const result = await Promise.all(
            (orders || []).map(async (o: any) => {
                const full = await orderService.getOrderWithTotal(o.id);
                // Si por alguna razón getOrderWithTotal devuelve null, devolvemos la orden básica con total 0
                return full || {order: o, total: 0};
            })
        );

        return res.json(result);
    } catch (err: any) {
        console.error('listOrdersHandler error:', err);
        return res.status(500).json({message: err.message || 'Internal server error'});
    }
}
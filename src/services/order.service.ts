import {Order, Product, OrderProduct, sequelize} from '../models';
import {Op} from 'sequelize';

export async function createOrder(userId: number, products: { productId: number; quantity: number }[]) {
    return sequelize.transaction(async (t) => {
        const order = await Order.create({userId}, {transaction: t});

        // Asociar productos manualmente
        for (const p of products) {
            const product = await Product.findByPk(p.productId, {transaction: t});
            if (!product) throw new Error(`Product ${p.productId} not found`);
            await OrderProduct.create(
                {
                    orderId: order.id,
                    productId: product.id,
                    quantity: p.quantity,
                    unitPrice: product.price,
                },
                {transaction: t}
            );
        }

        // ✅ Forzar recarga de relaciones después de insertar
        await order.reload({
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: {attributes: ['quantity', 'unitPrice']},
                },
            ],
            transaction: t,
        });

        return order;
    });
}

export async function getOrderWithTotal(orderId: number) {
    const order = await Order.findByPk(orderId, {
        include: [
            {
                model: Product,
                as: 'products',
                through: {attributes: ['quantity', 'unitPrice']},
            },
        ],
    });

    if (!order) return null;

    const products = (order as any).products || [];

    const total = products.reduce(
        (sum: number, p: any) =>
            sum + Number(p.OrderProduct?.quantity || 0) * Number(p.OrderProduct?.unitPrice || 0),
        0
    );

    return {order, total};
}

export async function filterOrdersByStatus(statuses: string[]) {
    return Order.findAll({where: {status: {[Op.in]: statuses}}});
}

export async function filterOrdersByDate(afterDate: Date) {
    return Order.findAll({where: {date: {[Op.gt]: afterDate}}});
}
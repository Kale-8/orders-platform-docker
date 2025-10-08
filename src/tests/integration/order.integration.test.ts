import {sequelize, Order, Product, OrderProduct, User} from '../../models';
import * as orderService from '../../services/order.service';

beforeAll(async () => {
    await sequelize.sync({force: true});
});

afterAll(async () => {
    await sequelize.close();
});

describe('Order Service - Integration', () => {
    it('should create an order and calculate total', async () => {
        const user = await User.create({name: 'Bob', email: 'b@x.com'});
        const p1 = await Product.create({name: 'Burger', price: 5.5});
        const p2 = await Product.create({name: 'Fries', price: 2.5});

        const order = await orderService.createOrder(user.id, [
            {productId: p1.id, quantity: 2},
            {productId: p2.id, quantity: 1},
        ]);

        expect(order).toBeDefined();
        expect(order.products?.length).toBe(2);

        const result = await orderService.getOrderWithTotal(order.id);
        expect(result?.total).toBeCloseTo(5.5 * 2 + 2.5, 2);
    });

    it('should throw an error if product not found', async () => {
        const user = await User.create({name: 'Alice', email: 'a@x.com'});
        await expect(
            orderService.createOrder(user.id, [{productId: 999, quantity: 1}])
        ).rejects.toThrow('Product 999 not found');
    });

    it('should return null if order not found in getOrderWithTotal', async () => {
        const result = await orderService.getOrderWithTotal(999);
        expect(result).toBeNull();
    });

    it('should filter orders by status', async () => {
        // Crea órdenes con distintos estados
        await Order.bulkCreate([
            {userId: 1, status: 'pending'},
            {userId: 1, status: 'preparing'},
            {userId: 1, status: 'delivered'},
        ]);

        const result = await orderService.filterOrdersByStatus(['pending', 'delivered']);
        const statuses = result.map((o) => o.status);

        expect(statuses).toContain('pending');
        expect(statuses).toContain('delivered');
        expect(statuses).not.toContain('cancelled');
    });

    it('should filter orders by date', async () => {
        const oldOrder = await Order.create({
            userId: 1,
            date: new Date('2020-01-01'),
            status: 'delivered',
        });

        const newOrder = await Order.create({
            userId: 1,
            date: new Date(),
            status: 'pending',
        });

        const result = await orderService.filterOrdersByDate(new Date('2021-01-01'));
        const ids = result.map((r) => r.id);

        expect(ids).toContain(newOrder.id);
        expect(ids).not.toContain(oldOrder.id);
    });
});
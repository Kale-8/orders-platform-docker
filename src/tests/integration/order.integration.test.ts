// Test de integración que usa sqlite in-memory (NODE_ENV=test)
import {sequelize, User, Product, Order, OrderProduct} from '../../models';
import * as orderService from '../../services/order.service';

beforeAll(async () => {
    await sequelize.sync({force: true});
});

afterAll(async () => {
    await sequelize.close();
});

test('create order and compute total', async () => {
    const user = await User.create({name: 'Bob', email: 'b@x.com'});
    const p1 = await Product.create({name: 'Burger', price: 5.5});
    const p2 = await Product.create({name: 'Fries', price: 2.5});

    const order = await orderService.createOrder(user.id, [{productId: p1.id, quantity: 2}, {
        productId: p2.id,
        quantity: 1
    }]);
    const result = await orderService.getOrderWithTotal(order.id);
    expect(result).not.toBeNull();
    expect(result?.total).toBeCloseTo(5.5 * 2 + 2.5, 2);
});
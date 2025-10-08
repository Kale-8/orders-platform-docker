import * as userService from '../../services/user.service';
import {User} from '../../models';

jest.mock('../../models', () => ({
    User: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
    },
}));

describe('User Service (unit)', () => {
    it('should create a user successfully', async () => {
        const mockUser = {id: 1, name: 'Alice', email: 'a@x.com', role: 'client'};
        // @ts-ignore
        User.create.mockResolvedValue(mockUser);

        const result = await userService.createUser({name: 'Alice', email: 'a@x.com'});
        expect(result).toEqual(mockUser);
        expect(User.create).toHaveBeenCalledWith({name: 'Alice', email: 'a@x.com'});
    });

    it('should get user by id with orders', async () => {
        const mockUser = {id: 1, name: 'Bob', orders: []};
        // @ts-ignore
        User.findByPk.mockResolvedValue(mockUser);

        const result = await userService.getUserById(1);
        expect(result).toEqual(mockUser);
        expect(User.findByPk).toHaveBeenCalledWith(1, {include: ['orders']});
    });

    it('should list all users', async () => {
        const mockList = [
            {id: 1, name: 'John'},
            {id: 2, name: 'Jane'},
        ];
        // @ts-ignore
        User.findAll.mockResolvedValue(mockList);

        const result = await userService.listUsers();
        expect(result).toEqual(mockList);
        expect(User.findAll).toHaveBeenCalled();
    });
});
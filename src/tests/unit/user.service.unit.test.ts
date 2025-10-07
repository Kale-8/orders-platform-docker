// Test unitario que mockea User.create para no usar BD real
import * as userService from '../../services/user.service';
import {User} from '../../models';

jest.mock('../../models', () => ({
    User: {create: jest.fn()}
}));

describe('User service (unit)', () => {
    it('should create a user and return it', async () => {
        const mockUser = {id: 1, name: 'Alice', email: 'a@x.com', role: 'client'};
        // @ts-ignore
        User.create.mockResolvedValue(mockUser);

        const result = await userService.createUser({name: 'Alice', email: 'a@x.com'});
        expect(result).toEqual(mockUser);
        // @ts-ignore
        expect(User.create).toHaveBeenCalledWith({name: 'Alice', email: 'a@x.com'});
    });
});
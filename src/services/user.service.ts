// Servicio simple para CRUD de usuarios
import {User} from '../models';

export async function createUser(payload: { name: string; email: string; role?: 'admin' | 'client' }) {
    // Crea y devuelve el usuario
    return await User.create(payload);
}

export async function getUserById(id: number) {
    return await User.findByPk(id, {include: ['orders']});
}

export async function listUsers() {
    return User.findAll();
}
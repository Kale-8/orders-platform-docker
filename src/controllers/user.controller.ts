import {Request, Response} from 'express';
import * as userService from '../services/user.service';

export async function createUserHandler(req: Request, res: Response) {
    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    } catch (err: any) {
        return res.status(400).json({error: err.message});
    }
}

export async function getUserHandler(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({message: 'User not found'});
    return res.json(user);
}
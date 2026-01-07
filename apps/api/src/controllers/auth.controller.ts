import { FastifyInstance } from 'fastify';
import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '@splendly/utils';
import { z } from 'zod';

export const authController = {
    register: async (request: any, reply: any) => {
        const schema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { email, password } = schema.parse(request.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return reply.status(400).send({ message: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);
        const user = new User({ email, passwordHash });
        await user.save();

        const token = await reply.jwtSign({ id: user._id, email: user.email });
        return { token, user: { id: user._id, email: user.email } };
    },

    login: async (request: any, reply: any) => {
        const schema = z.object({
            email: z.string().email(),
            password: z.string(),
        });

        const { email, password } = schema.parse(request.body);

        const user = await User.findOne({ email });
        if (!user) {
            return reply.status(401).send({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return reply.status(401).send({ message: 'Invalid credentials' });
        }

        const token = await reply.jwtSign({ id: user._id, email: user.email });
        return { token, user: { id: user._id, email: user.email } };
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const user_model_1 = require("../models/user.model");
const utils_1 = require("@splendly/utils");
const zod_1 = require("zod");
exports.authController = {
    register: async (request, reply) => {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
        });
        const { email, password } = schema.parse(request.body);
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return reply.status(400).send({ message: 'User already exists' });
        }
        const passwordHash = await (0, utils_1.hashPassword)(password);
        const user = new user_model_1.User({ email, passwordHash });
        await user.save();
        const token = await reply.jwtSign({ id: user._id, email: user.email });
        return { token, user: { id: user._id, email: user.email } };
    },
    login: async (request, reply) => {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string(),
        });
        const { email, password } = schema.parse(request.body);
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return reply.status(401).send({ message: 'Invalid credentials' });
        }
        const isMatch = await (0, utils_1.comparePassword)(password, user.passwordHash);
        if (!isMatch) {
            return reply.status(401).send({ message: 'Invalid credentials' });
        }
        const token = await reply.jwtSign({ id: user._id, email: user.email });
        return { token, user: { id: user._id, email: user.email } };
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = expenseRoutes;
const expense_controller_1 = require("../controllers/expense.controller");
async function expenseRoutes(fastify) {
    fastify.addHook('onRequest', fastify.authenticate);
    fastify.get('/', expense_controller_1.expenseController.list);
    fastify.post('/', expense_controller_1.expenseController.create);
}

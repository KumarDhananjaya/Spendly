"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = syncRoutes;
const sync_controller_1 = require("../controllers/sync.controller");
async function syncRoutes(fastify) {
    fastify.addHook('onRequest', fastify.authenticate);
    fastify.post('/', sync_controller_1.syncController.sync);
}

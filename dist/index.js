"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv");
const express_1 = __importDefault(require("express"));
const redis_1 = __importDefault(require("redis"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const resolvers_1 = require("./resolvers");
const cloudConncection_1 = require("./cloudConncection");
const main = async () => {
    await (0, cloudConncection_1.cloudConnection)();
    if (!cloudConncection_1.cloudConnection) {
        throw new Error();
    }
    else {
        console.log("conectado a digitalocean");
    }
    await (0, typeorm_1.createConnection)();
    const app = (0, express_1.default)();
    app.set("trust proxy", true);
    app.use((0, cors_1.default)({
        credentials: true,
        origin: [
            "https://studio.apollographql.com",
            "http://localhost:4000/graphql",
            "http://localhost:3000",
        ],
    }));
    const schema = await resolvers_1.schemaIndex;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({
            req,
            res,
            redis: redis_1.default,
        }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    const port = process.env.PORT || 4000;
    app.listen({ port }, () => {
        console.log(`server running on http://localhost:${port}/graphql :)`);
    });
};
main();
//# sourceMappingURL=index.js.map
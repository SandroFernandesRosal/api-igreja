"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const news_1 = require("./routes/vp/news");
const auth_1 = require("./routes/auth/auth");
const authIgreja_1 = require("./routes/auth/authIgreja");
const upload_1 = require("./routes/upload");
const node_path_1 = require("node:path");
const ministerio_1 = require("./routes/vp/ministerio");
const agenda_1 = require("./routes/vp/agenda");
const agenda_2 = require("./routes/caxias/agenda");
const ministerio_2 = require("./routes/caxias/ministerio");
const news_2 = require("./routes/caxias/news");
const agenda_3 = require("./routes/tomazinho/agenda");
const ministerio_3 = require("./routes/tomazinho/ministerio");
const news_3 = require("./routes/tomazinho/news");
const doacao_1 = require("./routes/doacao");
const testemunho_1 = require("./routes/testemunho");
const endereco_1 = require("./routes/endereco");
const contato_1 = require("./routes/contato");
const sobre_1 = require("./routes/sobre");
const sobreLider_1 = require("./routes/sobreLider");
const app = (0, fastify_1.default)();
app.register(multipart_1.default);
app.register(require('@fastify/static'), {
    root: (0, node_path_1.resolve)(__dirname, '../uploads'),
    prefix: '/uploads',
});
app.register(cors_1.default, {
    origin: true,
});
app.register(jwt_1.default, {
    secret: 'alcancadospelagraca',
});
app.register(cookie_1.default);
app.register(auth_1.authRoutes);
app.register(authIgreja_1.authIgrejaRoutes);
app.register(upload_1.uploadRoutes);
app.register(news_1.memoriesRoutes);
app.register(ministerio_1.ministerioRoutes);
app.register(agenda_1.agendaRoutes);
app.register(agenda_2.agendaRoutesCaxias);
app.register(ministerio_2.ministerioRoutesCaxias);
app.register(news_2.memoriesRoutesCaxias);
app.register(agenda_3.agendaRoutesTomazinho);
app.register(ministerio_3.ministerioRoutesTomazinho);
app.register(news_3.memoriesRoutesTomazinho);
app.register(doacao_1.doacaoRoutes);
app.register(endereco_1.enderecoRoutes);
app.register(testemunho_1.testemunhoRoutes);
app.register(contato_1.contatoRoutes);
app.register(sobre_1.sobreRoutes);
app.register(sobreLider_1.sobreLiderRoutes);
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app
    .listen({
    host: '0.0.0.0',
    port: PORT,
})
    .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
});

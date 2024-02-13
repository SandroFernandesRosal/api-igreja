"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function authRoutes(app) {
    app.get('/register', async (request) => {
        const users = await prisma_1.prisma.user.findMany();
        return users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
                login: user.login,
                password: user.password,
            };
        });
    });
    app.get('/register/:id', async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const user = await prisma_1.prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return user;
    });
    app.post('/login', async (request) => {
        const userSchema = zod_1.z.object({
            login: zod_1.z.string(),
            password: zod_1.z.string(),
        });
        try {
            const { login, password } = userSchema.parse(request.body);
            const user = await authenticateUser(login, password);
            if (!user) {
                return { error: 'Credenciais inválidas.' };
            }
            const token = app.jwt.sign({
                name: user.name,
                avatarUrl: user.avatarUrl,
                login: user.login,
            }, {
                sub: user.id,
                expiresIn: '30 days',
            });
            return { user, token };
        }
        catch (error) {
            console.error(error);
            return { error: 'Erro na autenticação' };
        }
    });
    async function authenticateUser(login, password) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                login,
            },
        });
        if (!user) {
            return false;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        return isPasswordValid ? user : false;
    }
    app.post('/register', async (request) => {
        const userSchema = zod_1.z.object({
            login: zod_1.z.string(),
            name: zod_1.z.string(),
            avatarUrl: zod_1.z.string().url(),
            password: zod_1.z.string(),
        });
        try {
            const { login, name, avatarUrl, password } = userSchema.parse(request.body);
            const senhaCriptografada = await bcryptjs_1.default.hash(password, 10);
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: {
                    login,
                },
            });
            if (!bcryptjs_1.default.compare(password, senhaCriptografada)) {
                return {
                    error: `Senha incorreta.`,
                };
            }
            if (!existingUser) {
                const user = await prisma_1.prisma.user.create({
                    data: {
                        login,
                        name,
                        avatarUrl,
                        password: senhaCriptografada,
                    },
                });
                const token = app.jwt.sign({
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    login: user.login,
                    password: user.password,
                }, {
                    sub: user.id,
                    expiresIn: '30 days',
                });
                return { user, token };
            }
            else {
                return { error: `Usuário ${login} já existe.` };
            }
        }
        catch (error) {
            console.error(error);
            return { error: 'Erro ao criar usuário' };
        }
    });
    app.put('/register/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            avatarUrl: zod_1.z.string(),
            password: zod_1.z.string(),
        });
        const { name, avatarUrl, password } = bodySchema.parse(request.body);
        const user = await prisma_1.prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                avatarUrl,
                password,
            },
        });
        return user;
    });
    app.delete('/register/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.user.delete({
            where: {
                id,
            },
        });
    });
}
exports.authRoutes = authRoutes;

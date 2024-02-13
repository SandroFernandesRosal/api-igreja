"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoriesRoutesTomazinho = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function memoriesRoutesTomazinho(app) {
    app.get('/news/tomazinho', async (request) => {
        const memories = await prisma_1.prisma.newTomazinho.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return memories.map((memory) => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                title: memory.title,
                content: memory.content,
                excerpt: memory.content.substring(0, 115).concat('...'),
                createdAt: memory.createdAt,
                page: memory.page,
            };
        });
    });
    app.get('/news/tomazinho/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const memory = await prisma_1.prisma.newTomazinho.findUniqueOrThrow({
            where: {
                id,
            },
        });
        if (!memory.isPublic && memory.userId !== request.user.sub) {
            return reply.status(401).send();
        }
        return memory;
    });
    app.get('/news/tomazinho/search', async (request) => {
        const paramsSchema = zod_1.z.object({
            search: zod_1.z.string(),
        });
        try {
            const { search } = paramsSchema.parse(request.query);
            if (!search) {
                throw new Error('Query parameter is missing');
            }
            const memories = await prisma_1.prisma.newTomazinho.findMany({
                where: {
                    OR: [{ title: { contains: search } }],
                },
            });
            return memories.map((memory) => {
                return {
                    id: memory.id,
                    coverUrl: memory.coverUrl,
                    title: memory.title,
                    content: memory.content,
                    excerpt: memory.content.substring(0, 115).concat('...'),
                    createdAt: memory.createdAt,
                    page: memory.page,
                };
            });
        }
        catch (error) {
            // Trate o erro de maneira apropriada, como retornar um código de erro HTTP 500
            return { error: 'Internal Server Error' };
        }
    });
    app.post('/news/tomazinho', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            content: zod_1.z.string(),
            coverUrl: zod_1.z.string(),
            title: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            page: zod_1.z.string(),
        });
        const { content, coverUrl, isPublic, title, page } = bodySchema.parse(request.body);
        const memory = await prisma_1.prisma.newTomazinho.create({
            data: {
                content,
                coverUrl,
                title,
                isPublic,
                userId: request.user.sub,
                page,
            },
        });
        return memory;
    });
    app.put('/news/tomazinho/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            content: zod_1.z.string(),
            coverUrl: zod_1.z.string(),
            title: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            page: zod_1.z.string(),
        });
        const { content, coverUrl, isPublic, title, page } = bodySchema.parse(request.body);
        let memory = await prisma_1.prisma.newTomazinho.findUniqueOrThrow({
            where: {
                id,
            },
        });
        memory = await prisma_1.prisma.newTomazinho.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                title,
                isPublic,
                page,
            },
        });
        return memory;
    });
    app.delete('/news/tomazinho/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.newTomazinho.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.newTomazinho.delete({
            where: {
                id,
            },
        });
    });
}
exports.memoriesRoutesTomazinho = memoriesRoutesTomazinho;

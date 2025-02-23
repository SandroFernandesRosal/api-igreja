"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoriesRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function memoriesRoutes(app) {
    app.get('/news/viladapenha', async (request) => {
        const offsetQuery = request.query.offset;
        const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0;
        const itemsPerPage = 6;
        const news = await prisma_1.prisma.new.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: itemsPerPage,
        });
        const newsTotal = await prisma_1.prisma.new.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { news, newsTotal };
    });
    app.get('/news/viladapenha/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const memory = await prisma_1.prisma.new.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return memory;
    });
    app.get('/news/viladapenha/search', async (request) => {
        const paramsSchema = zod_1.z.object({
            search: zod_1.z.string(),
        });
        try {
            const { search } = paramsSchema.parse(request.query);
            if (!search) {
                throw new Error('Query parameter is missing');
            }
            const memories = await prisma_1.prisma.new.findMany({
                where: {
                    OR: [{ title: { contains: search } }],
                },
            });
            return memories;
        }
        catch (error) {
            // Trate o erro de maneira apropriada, como retornar um código de erro HTTP 500
            return { error: 'Internal Server Error' };
        }
    });
    app.post('/news/viladapenha', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            content: zod_1.z.string(),
            coverUrl: zod_1.z.string(),
            title: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            destaque: zod_1.z.coerce.boolean().default(false),
            page: zod_1.z.string(),
        });
        const { content, coverUrl, isPublic, title, page, destaque } = bodySchema.parse(request.body);
        const memory = await prisma_1.prisma.new.create({
            data: {
                content,
                coverUrl,
                title,
                isPublic,
                userId: request.user.sub,
                page,
                destaque,
            },
        });
        return memory;
    });
    app.put('/news/viladapenha/:id', async (request, reply) => {
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
            destaque: zod_1.z.coerce.boolean().default(false),
            page: zod_1.z.string(),
        });
        const { content, coverUrl, isPublic, title, page, destaque } = bodySchema.parse(request.body);
        let memory = await prisma_1.prisma.new.findUniqueOrThrow({
            where: {
                id,
            },
        });
        memory = await prisma_1.prisma.new.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                title,
                isPublic,
                page,
                destaque,
            },
        });
        return memory;
    });
    app.delete('/news/viladapenha/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.new.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.new.delete({
            where: {
                id,
            },
        });
    });
}
exports.memoriesRoutes = memoriesRoutes;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ministerioRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function ministerioRoutes(app) {
    app.get('/ministerio/viladapenha', async (request) => {
        const offsetQuery = request.query.offset;
        const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0;
        const itemsPerPage = 12;
        const ministerio = await prisma_1.prisma.ministerio.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: itemsPerPage,
        });
        return ministerio;
    });
    app.get('/minsterio/viladapenha/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const ministerio = await prisma_1.prisma.ministerio.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return ministerio;
    });
    app.post('/ministerio/viladapenha', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            title: zod_1.z.string(),
            local: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            coverUrl: zod_1.z.string(),
        });
        const { name, title, isPublic, local, coverUrl } = bodySchema.parse(request.body);
        const ministerio = await prisma_1.prisma.ministerio.create({
            data: {
                name,
                title,
                local,
                isPublic,
                userId: request.user.sub,
                coverUrl,
            },
        });
        return ministerio;
    });
    app.put('/ministerio/viladapenha/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            title: zod_1.z.string(),
            local: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            coverUrl: zod_1.z.string(),
        });
        const { name, title, isPublic, local, coverUrl } = bodySchema.parse(request.body);
        let ministerio = await prisma_1.prisma.ministerio.findUniqueOrThrow({
            where: {
                id,
            },
        });
        ministerio = await prisma_1.prisma.ministerio.update({
            where: {
                id,
            },
            data: {
                name,
                title,
                local,
                isPublic,
                coverUrl,
            },
        });
        return ministerio;
    });
    app.delete('/ministerio/viladapenha/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.ministerio.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.ministerio.delete({
            where: {
                id,
            },
        });
    });
}
exports.ministerioRoutes = ministerioRoutes;

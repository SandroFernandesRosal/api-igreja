"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendaRoutesCaxias = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function agendaRoutesCaxias(app) {
    app.get('/agenda/caxias', async (request) => {
        const offsetQuery = request.query.offset;
        const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0;
        const itemsPerPage = 12;
        const agenda = await prisma_1.prisma.agendaCaxias.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: itemsPerPage,
        });
        return agenda;
    });
    app.get('/agenda/caxias/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const agenda = await prisma_1.prisma.agendaCaxias.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return agenda;
    });
    app.post('/agenda/caxias', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            day: zod_1.z.string(),
            hour: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            destaque: zod_1.z.coerce.boolean().default(false),
        });
        const { name, day, isPublic, hour, destaque } = bodySchema.parse(request.body);
        const agenda = await prisma_1.prisma.agendaCaxias.create({
            data: {
                name,
                day,
                hour,
                isPublic,
                userId: request.user.sub,
                destaque,
            },
        });
        return agenda;
    });
    app.put('/agenda/caxias/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            day: zod_1.z.string(),
            hour: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            destaque: zod_1.z.coerce.boolean().default(false),
        });
        const { name, day, isPublic, hour, destaque } = bodySchema.parse(request.body);
        let agenda = await prisma_1.prisma.agendaCaxias.findUniqueOrThrow({
            where: {
                id,
            },
        });
        agenda = await prisma_1.prisma.agendaCaxias.update({
            where: {
                id,
            },
            data: {
                name,
                day,
                hour,
                isPublic,
                destaque,
            },
        });
        return agenda;
    });
    app.delete('/agenda/caxias/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.agendaCaxias.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.agendaCaxias.delete({
            where: {
                id,
            },
        });
    });
}
exports.agendaRoutesCaxias = agendaRoutesCaxias;

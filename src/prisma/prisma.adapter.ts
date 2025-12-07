import { PrismaPg } from "@prisma/adapter-pg";
import { ConfigService } from '@nestjs/config';

export const createPrismaPgAdapter = (config: ConfigService) => {
    const url = config.get('DATABASE_URL');
    if (!url) {
        throw new Error("DATABASE_URL is not set");
    }
    const parsed = new URL(url.toString());

    return new PrismaPg({
        host: parsed.hostname,
        port: Number(parsed.port),
        user: parsed.username,
        password: parsed.password,
        database: parsed.pathname.slice(1),
    });
}
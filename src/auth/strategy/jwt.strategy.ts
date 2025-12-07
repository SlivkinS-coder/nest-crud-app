import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not set in configuration');
        }
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: {
        sub: number,
        email: string
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
          }

        const {hash, ...userSafe } = user;
        return userSafe;
    }
}
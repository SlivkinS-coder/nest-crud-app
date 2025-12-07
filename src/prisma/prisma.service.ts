import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaPgAdapter } from './prisma.adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient{
  constructor(config: ConfigService) {
    super({
      adapter: createPrismaPgAdapter(config),
    });
  }
  
  cleanDB() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}

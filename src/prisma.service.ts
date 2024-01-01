import { PrismaClient } from '@prisma/client';

export class PrismaService {
  public db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }
}

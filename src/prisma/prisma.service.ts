import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from '@prisma/adapter-pg';
import { connect } from 'http2';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }
  
  async onModuleInit() {
    await this.$connect();
  }
}

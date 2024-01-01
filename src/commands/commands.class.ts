import { Telegraf } from 'telegraf';
import { TBotContext } from '../types';

import { PrismaService } from '../prisma.service';
import { UserService } from '../user.service';
import { BookingService } from '../booking.service';
import { TConfigService } from '../config/config.service';

export abstract class Service {
  constructor(public prismaService: PrismaService) {}
}

export abstract class Command {
  constructor(
    public bot: Telegraf<TBotContext>,

    public userService?: UserService,
    public bookingService?: BookingService,
    public configService?: TConfigService
  ) {}
  abstract handle(): void;
}

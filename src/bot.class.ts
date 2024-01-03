import { Telegraf } from 'telegraf';
import { TBotContext } from './types';
import { TConfigService } from './config/config.service';
import LocalSession from 'telegraf-session-local';
import { Command } from './commands/commands.class';
import { StartCommand } from './commands/start.command';
import { SelectionCommand } from './commands/selection.command';
import { UserService } from './user.service';
import { BookingService } from './booking.service';
import { BookingCommand } from './commands/booking.command';

export class Bot {
  private bot: Telegraf<TBotContext>;

  private commands: Command[] = [];
  constructor(
    private readonly configService: TConfigService,
    private readonly userService: UserService,
    private readonly bookingService: BookingService
  ) {
    this.bot = new Telegraf<TBotContext>(this.configService.get('BOT_TOKEN'), {});
    this.bot.use(new LocalSession({ database: './session.json' })).middleware();
  }
  async init() {
    this.commands = [
      new StartCommand(this.bot, this.userService, this.bookingService, this.configService),
      new SelectionCommand(this.bot, this.userService, this.bookingService),
      new BookingCommand(this.bot, this.bookingService),
    ];

    for (const command of this.commands) {
      command.handle();
    }
    await this.bot.launch({
      webhook: {
        domain:
          'https://webhooks.amplify.eu-west-2.amazonaws.com/prod/webhooks?id=738107f7-f88a-465c-a5ea-44e76b246485&token=th5CBRutdK2q7yXJmKEe3n3Vn6AUlLSA1rGzJzH3LY',
      },
    });

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}

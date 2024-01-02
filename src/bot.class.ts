import { Telegraf } from 'telegraf';
import { TBotContext } from './types';
import { TConfigService } from './config/config.service';
import LocalSession from 'telegraf-session-local';
import { Command, Service } from './commands/commands.class';
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

    await this.bot
      .launch({
        webhook: {
          domain: 'https://api.telegram.org/bot6723599492:AAFyakSDGl6ot1fMNOP-6cdHCELxtQtV9Rs/setWebhook',
        },
      })
      .then(() => {
        console.info(`The bot ${this.bot.botInfo.username} is running on server`);
      });

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
  getBot() {
    return this.bot;
  }
}

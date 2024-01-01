import { Markup, Telegraf, session } from 'telegraf';
import { Command } from './commands.class';
import { BookingsTypeWithUser, TBotContext } from '../types';
import { UserService } from '../user.service';
import { errorButtons, existingBookingsButtons, selectionButtons } from '../lib/buttons';
import { SESSION_MESSAGES } from '../lib/constats';
import { getCallendar } from './booking.command';
import { BookingService } from '../booking.service';
import { AdminButtons } from '../lib/admin.buttons';
import { TConfigService } from '../config/config.service';

export let times: string[] = [
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];
export let adminMessages: number[] = [];
export let adminButtons: AdminButtons;
export class StartCommand extends Command {
  constructor(
    bot: Telegraf<TBotContext>,
    userService: UserService,
    bookingService: BookingService,
    configService: TConfigService
  ) {
    super(bot, userService, bookingService, configService);
  }

  handle(): void {
    this.bot.start(async (ctx) => {
      adminButtons = new AdminButtons(ctx);
      ctx.session.stage = 'selection';
      ctx.session.date = null;
      ctx.session.type = null;
      ctx.session.times = [];
      ctx.session.messages = SESSION_MESSAGES;
      let user = null;
      const { result, err } = await this.userService.getUserByID(ctx.update.message.from.id);
      if (err) await errorButtons(ctx, err.message);
      if (!result) {
        const { id } = ctx.update.message.from;
        let first_name = ctx.update.message.from.first_name;
        let last_name = ctx.update.message.from.last_name;

        const { result, err } = await this.userService.createUser({ id, first_name, last_name });
        if (err) await errorButtons(ctx, err.message);

        user = result;
      }
      user = result;
      ctx.session.records = user.recordId;
      ctx.session.user = user;

      if (ctx.session.user.telegramId === +this.configService.get('ADMIN_ID')) {
        ctx.session.adminMessages = [];
        const calendar = getCallendar(this.bot);
        await adminButtons.calendarButtons(calendar);

        calendar.setDateListener(async (_, date) => {
          if (ctx.session.date === date) return;

          ctx.session.date = date;
          ctx.session.adminRecords = await this.bookingService.getBookingsByDate(ctx.session.date);

          await adminButtons.bookingsButtons(ctx.session.adminRecords);
        });

        adminMessages = ctx.session.adminMessages;
      } else {
        selectionButtons(ctx);

        if (ctx.session.records.length > 0) {
          await existingBookingsButtons(ctx, user.recordId);
        }
      }
    });
  }
}

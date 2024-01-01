import { Markup, Telegraf } from 'telegraf';
import { Command } from './commands.class';
import { PhotoSession, TBotContext } from '../types';
import { CallbackQuery } from 'telegraf/types';

import { UserService } from '../user.service';
import { CONTENT } from '../lib/constats';
import { BookingService } from '../booking.service';
import { deleteButtons } from '../lib/common.buttons';

export class SelectionCommand extends Command {
  constructor(bot: Telegraf<TBotContext>, userService: UserService, bookingService: BookingService) {
    super(bot, userService, bookingService);
  }

  handle(): void {
    this.bot.action(
      CONTENT.map((r) => r.alias),
      async (ctx) => {
        if (ctx.session.messages.cancelBooking > 0) await deleteButtons(ctx, 'cancelBooking');

        const { data } = ctx.callbackQuery as CallbackQuery.DataQuery;
        ctx.session.type = data as PhotoSession;
        const { description, time } = CONTENT.find((r) => r.alias === data);
        ctx.session.description = description;
        ctx.session.typeLength = time;
        await ctx.editMessageText(
          { text: CONTENT.find((r) => r.alias === data).content },

          Markup.inlineKeyboard([
            [Markup.button.callback('Проверить даты 📅:', 'book')],

            CONTENT.filter((f) => f.alias !== data).map((d) => Markup.button.callback(d.title, d.alias)),
          ])
        );
        //delete previous timeslots and add new one on the page depending on the type
        if (ctx.session.messages.time > 0) {
          await deleteButtons(ctx, 'time');
          this.bookingService.showTimeSlots(ctx);
        }
      }
    );
  }
}

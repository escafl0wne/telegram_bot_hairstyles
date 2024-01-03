import { Markup } from 'telegraf';
import { BookTimeType, BookingsTypeWithUser, TBotContext } from '../types';
import { deleteButtons, formatDate } from './common.buttons';

export class AdminButtons {
  constructor(private readonly ctx: TBotContext) {}
  async calendarButtons(calendar: any) {
    if (this.ctx.session.messages.admin > 0) await deleteButtons(this.ctx, 'admin');
    this.ctx.session.messages.admin = (
      await this.ctx.reply('Приветствую Виктория! ', calendar.getCalendar())
    ).message_id;
  }
  async bookingsButtons(bookings: BookingsTypeWithUser[]) {
    if (this.ctx.session.messages.bookings > 0) await deleteButtons(this.ctx, 'bookings');

    let ind = 0;
    if (bookings.length > 0)
      for await (const record of bookings) {
        this.ctx.session.adminMessages.push(
          (
            await this.ctx.reply(
              `Запись ${ind + 1}:\nУслуга: ${record.serviceDescription}\nДата и время: ${formatDate(
                record.date.date
              )} ${record.time.timeSlot}\nКлиент: ${record.user.firstName} ${record.user.secondName}`,
              Markup.inlineKeyboard([Markup.button.callback('Отменить бронирование.', `admin_cancel_${ind}`)])
            )
          ).message_id
        );

        ind++;
      }
    else this.ctx.session.adminMessages.push((await this.ctx.reply('У вас нет записей на данный день!')).message_id);
  }
  async cancelResponseButtons(text: string) {
    let id = this.ctx.session.adminCancelResponseMessage;
    if (id > 0) await deleteButtons(this.ctx, 'adminCancelResponseMessage', true);
    this.ctx.session.adminCancelResponseMessage = (await this.ctx.reply(text)).message_id;
  }
}

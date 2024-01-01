import { Markup, Telegraf, Telegram } from 'telegraf';
import { Command } from './commands.class';
import { TBotContext } from '../types';
import Calendar from 'telegraf-calendar-telegram';

import { BookingService } from '../booking.service';
import { adminButtons, times } from './start.command';
import { CallbackQuery } from 'telegraf/types';

import {
  deleteButtons,
  cancelBookingButtons,
  existingBookingsButtons,
  formatDate,
  selectionButtons,
  AdminButtons,
  errorButtons,
} from '../lib';
const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string);
export function getCallendar(bot: Telegraf<TBotContext>) {
  const minDate = new Date();
  const maxDate = addMonths(new Date(), 2);

  const calendar = new Calendar(bot, {
    startWeekDay: 1,
    minDate,
    maxDate,
    weekDayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });
  return calendar;
}
function addMonths(date, months) {
  date.setMonth(date.getMonth() + months);

  return date;
}
export class BookingCommand extends Command {
  constructor(bot: Telegraf<TBotContext>, bookingService: BookingService) {
    super(bot, null, bookingService);
  }

  handle(): void {
    const calendar = getCallendar(this.bot);
    this.bot.action('book', async (ctx) => {
      if (ctx.session.messages.calendar > 0) return;

      ctx.session.messages.calendar = (
        await ctx.reply({ text: 'Пожалуйста, выберите дату📅: ' }, calendar.getCalendar())
      ).message_id;
      ctx.session.stage = 'bookingDate';
      // listen for the selected date event
      calendar.setDateListener(async (_, date) => {
        if (ctx.session.date === date) return;
        ctx.session.date = date;

        ctx.session.timeSlots = await this.bookingService.getTimeSlots(date);
        await this.bookingService.showTimeSlots(ctx);
      });
    });
    this.bot.action(/^([0-9][0-9]:[0-9][0-9])$/, async (ctx) => {
      const { data } = ctx.callbackQuery as CallbackQuery.DataQuery;
      const { description, date } = ctx.session;

      ctx.session.selectedTime = data;

      ctx.session.messages.confirm = (
        await ctx.reply(
          `Вы желаете прийти к нам на ${description} в ${formatDate(date)} ${data}`,
          Markup.inlineKeyboard(
            [Markup.button.callback('Подтвердить запись!💕', 'confirm'), Markup.button.callback('Отмена☠️', 'abort')],
            {
              columns: 2,
            }
          )
        )
      ).message_id;
    });
    this.bot.action('confirm', async (ctx) => {
      await deleteButtons(ctx, 'confirm');
      //attempt to create booking
      const { isCreated, error } = await this.bookingService.createBooking(ctx);

      //on error reply to the user with the error message
      if (error) errorButtons(ctx, error.message);
      //othwerise provide feedback of success
      ctx.session.messages.result = (await ctx.reply('Поздравляем, услуга забронированна!')).message_id;
      await new Promise((resolve) => {
        setTimeout(async () => {
          Object.entries(ctx.session.messages).forEach(async ([v, k]) =>
            k > 0 ? await deleteButtons(ctx, ctx.session.messages[v]) : null
          );
          ctx.session.selectedTime = '';
          ctx.session.date = null;
          ctx.session.stage = 'selection';
          ctx.session.type = null;
          ctx.session.typeLength = 0;
          ctx.session.description = '';
          resolve(true);
        }, 1500);
      });

      await selectionButtons(ctx);
      const bookings = await this.bookingService.getBookings(ctx.callbackQuery.from.id);
      if (bookings.length > 0) await existingBookingsButtons(ctx, bookings);
    });
    this.bot.action('abort', async (ctx) => {
      await deleteButtons(ctx, 'confirm');
      await deleteButtons(ctx, 'time');
      ctx.session.stage = 'bookingDate';
      ctx.session.selectedTime = '';
      ctx.session.date = null;
    });
    this.bot.action('cancel_booking', async (ctx) => {
      await cancelBookingButtons(ctx, "Пожалуйста укажите номер записи в формате '1,2'");
    });
    this.bot.on('text', async (ctx) => {
      //listen to the text input from the user
      const ids = ctx.message.text
        .split(',')
        .map((r) => {
          if (+r > 0) return +r;
        })
        .filter((r) => typeof r === 'number' && r);

      //if user hasnt typed in a coorect id send back an reponse
      if (ids.length === 0) {
        await cancelBookingButtons(ctx, 'Вы ввели неверные ID брони, пожалуйта попробуйте снова.');

        return;
      }
      //othwerwise proceed to get real booking ids
      const bookingsToDelete = [];
      ids.forEach((i) => {
        const booking = ctx.session.records[i - 1];
        if (booking) bookingsToDelete.push(booking.id);
      });
      //delete the bookings
      const isDeleted = await this.bookingService.cancelBooking(ctx, bookingsToDelete);

      //provide the feedback to the user about the succession
      if (isDeleted) {
        deleteButtons(ctx, 'bookings');
        if (ctx.session.records.length > 0) existingBookingsButtons(ctx, ctx.session.records);

        await cancelBookingButtons(
          ctx,
          `${ids.length > 0 ? 'Брони были успешно удалены.' : 'Бронь была успешно удалена.'} `
        );
      }

      //delete the message
      await new Promise((resolve) => {
        setTimeout(async () => {
          await deleteButtons(ctx, 'cancelBooking');
          resolve(true);
        }, 1500);
      });
    });

    this.bot.action(/^admin_cancel_(\d+)$/, async (ctx) => {
      const { data } = ctx.callbackQuery as CallbackQuery.DataQuery;
      const booking = ctx.session.adminRecords[+data.split('_')[2]];
      const isCanceled = await this.bookingService.cancelBooking(ctx, [booking.id], true);
      if (!isCanceled)
        await adminButtons.cancelResponseButtons(`Возникла ошибка при отмене бронирования ${booking.id}`!);
      await adminButtons.cancelResponseButtons(`Запись была успешно удалена!`);
      setTimeout(async () => {
        if (ctx.session.adminCancelResponseMessage > 0) await deleteButtons(ctx, 'adminCancelResponseMessage', true);
      }, 1500);
      if (ctx.session.adminRecords.length === 0) ctx.session.date = null;
      //send a notification to the person whos booking was canceled
      telegram.sendMessage(
        booking.user.telegramId,
        `Ваша запись на ${formatDate(booking.date.date)} ${booking.time.timeSlot} была отменена`
      );
    });
    /* The `this.bot.hears` function is used to listen for specific text patterns in user messages. In
    this case, it is listening for messages that match the pattern `^(Ваша запись на (\w)+)$`, which
    means it will trigger when the message starts with "Ваша запись на" followed by a word. */
    this.bot.hears(/^(Ваша запись на (\w)+)$/, async (ctx) => {
      //extract date and time of the deleted booking
      const [date, time] = ctx.message.text.split(' ').splice(4, 2);

      //update the users bookings
      const newBookings = ctx.session.records.filter(
        (r) => r.time.timeSlot === time && new Date(r.date.date) === new Date(date)
      );
      ctx.session.records = newBookings;
      if (newBookings.length > 0) await existingBookingsButtons(ctx, newBookings);
      else deleteButtons(ctx, 'bookings');
    });
  }
}

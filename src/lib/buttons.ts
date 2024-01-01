import { Markup } from 'telegraf';
import { BookingsType, ContentActions, TBotContext } from '../types';

export async function selectionButtons(ctx: TBotContext) {
  ctx.session.messages.selection = (
    await ctx.replyWithHTML(
      `<b>Приветствуем вас ${ctx.session.user.firstName} в ✨VictoriaHairStyles✨</b> \n\nМы предоставляем следующие виды услуг 📸:`,
      Markup.inlineKeyboard(
        CONTENT.map((r) => Markup.button.callback(r.title, r.alias)),

        { columns: 2 }
      )
    )
  ).message_id;
}
import { CONTENT } from './constats';
import { deleteButtons, formatDate } from './common.buttons';
export async function timeButtons(ctx: TBotContext, list: string[]) {
  ctx.session.messages.time = (
    list.length === 0
      ? await ctx.replyWithHTML('Приносим извенения, но на выбранную дату нет мест!')
      : await ctx.replyWithHTML(
          `Выберите время для записи на <b>${formatDate(ctx.session.date)}: </b>`,
          Markup.inlineKeyboard(
            list
              .map((r) => +r.split(':')[0])
              .sort((a, b) => a - b)

              .map((r) => Markup.button.callback(`${r}:00`, `${r}:00`)),
            { columns: 3 }
          )
        )
  ).message_id;
}
/**
 * The `existingBookingsButtons` function displays existing bookings to the user and provides a button
 * to cancel a booking.
 * @param {TBotContext} ctx - The parameter `ctx` is of type `TBotContext`, which is the context object
 * for the Telegram bot. It contains information about the current message, user, and other relevant
 * data.
 * @param {BookingsType[]} bookings - An array of booking records. Each booking record should have the
 * following properties:
 */
export async function existingBookingsButtons(ctx: TBotContext, bookings: BookingsType[]) {
  if (ctx.session.messages.bookings > 0) await deleteButtons(ctx, 'bookings');
  ctx.session.messages.bookings = (
    await ctx.reply(
      'Мы нашли следующие записи:\n\n' +
        bookings
          .map((record, index) => {
            return `${index + 1}) Вы записаны на : ${record.serviceDescription}\nДата и время: ${formatDate(
              record.date.date
            )} ${record.time.timeSlot}\n\n`;
          })
          .join(' ') +
        'Не переживайте,мы пришлем вам напоминание за 2 часа до начала.',
      Markup.inlineKeyboard([Markup.button.callback('Отменить бронирование.', 'cancel_booking')])
    )
  ).message_id;
}

/**
 * The function `cancelBookingButtons` is an asynchronous function that takes in a `TBotContext` and a
 * `text` string as parameters, and it is used to display and update cancel booking buttons in a chat.
 * @param {TBotContext} ctx - The parameter `ctx` is an object that represents the context of the
 * current bot operation. It contains information about the current user, chat, and message.
 * @param {string} text - The `text` parameter is a string that represents the text message that will
 * be displayed in the reply.
 */
export async function cancelBookingButtons(ctx: TBotContext, text: string) {
  if (ctx.session.messages.cancelBooking > 0) ctx.deleteMessage(ctx.session.messages.cancelBooking);
  ctx.session.messages.cancelBooking = (await ctx.reply(text)).message_id;
}
export async function errorButtons(ctx: TBotContext, text: string) {
  if (ctx.session.messages.errors > 0) await deleteButtons(ctx, 'errors');
  ctx.session.messages.errors = (await ctx.reply(text)).message_id;
  return;
}

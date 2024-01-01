import { TBotContext } from '../types';

export async function deleteButtons(ctx: TBotContext, value: string, isAdmin: boolean = false) {
  if (!isAdmin) {
    ctx.deleteMessage(ctx.session.messages[value]);
    ctx.session.messages[value] = 0;
  } else {
    ctx.deleteMessage(ctx.session.adminCancelResponseMessage);
    ctx.session.adminCancelResponseMessage = 0;
  }
}
export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

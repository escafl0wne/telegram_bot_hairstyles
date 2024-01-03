import { Service } from './commands/commands.class';

import { PrismaService } from './prisma.service';
import { BookingsType, BookingsTypeWithUser, TBotContext, TimeSlot } from './types';
import { Prisma } from '@prisma/client';
import { deleteButtons, timeButtons } from './lib';

export class BookingService extends Service {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  private canScheduleService(serviceLength: number, daySchedule: TimeSlot[], list: string[]) {
    // Assume the day starts at 9 AM and ends at 20 PM (8 PM)
    let dayStart = 9;
    let dayEnd = 20;

    // Iterate through existing services in the day schedul

    const notAllowedtimes: number[] = [];

    for (const service of daySchedule) {
      let r = service.timeStart;
      while (r <= service.timeEnd) {
        if (!notAllowedtimes.includes(r)) notAllowedtimes.push(r);

        r++;
      }
    }
    const starts = notAllowedtimes.filter((element, index) => index % 2 === 0);
    const ends = notAllowedtimes.filter((element, index) => index % 2 !== 0);

    let minNum = Math.min(...notAllowedtimes);
    let maxNum = Math.max(...notAllowedtimes);

    while (dayStart + serviceLength <= minNum) {
      list.push(`${dayStart}:00`);
      dayStart++;
    }

    while (dayEnd >= maxNum + serviceLength) {
      list.push(`${maxNum}:00`);
      maxNum++;
    }
    if (daySchedule.length > 1) {
      let t = 0;
      while (starts[t + 1] && starts[t + 1] >= ends[t] + serviceLength) {
        list.push(`${ends[t]}:00`);
        ends[t]++;
      }
    }

    return list.length > 0;
  }

  async showTimeSlots(ctx: TBotContext) {
    if (ctx.session.messages.time > 0) deleteButtons(ctx, 'time');
    let list: string[] = [];
    //check if there is enough timime in the day to fit the service

    if (ctx.session.timeSlots.length === 0) {
      const currentDate = new Date();
      const selectedDate = new Date(ctx.session.date);
      let lstTimeslot = 20;
      let timeSlot = 9;
      if (currentDate.toLocaleDateString('ru-Ru') == selectedDate.toLocaleDateString('ru-Ru')) {
        timeSlot = currentDate.getHours() + 1;
      }

      while (timeSlot <= lstTimeslot - ctx.session.typeLength) {
        list.push(`${timeSlot}:00`);
        timeSlot = timeSlot + 1;
      }
    } else {
      const isBookable = this.canScheduleService(
        ctx.session.typeLength,

        ctx.session.timeSlots,
        list
      );

      if (!isBookable) {
        ctx.session.messages.time = (await ctx.reply('На выбранную дату не осталось мест!')).message_id;
        return;
      }
    }

    await timeButtons(ctx, list);

    ctx.session.stage = 'bookingTime';
  }

  async getTimeSlots(date: Date): Promise<TimeSlot[] | []> {
    const dates = await this.prismaService.db.date.findFirst({
      where: {
        date: new Date(date),
      },
      select: {
        time: {
          select: {
            timeStart: true,
            timeEnd: true,
            timeSlot: true,
          },
        },
      },
    });

    return !dates ? [] : dates.time;
  }
  async createBooking(ctx: TBotContext): Promise<{ isCreated: boolean; error: Error }> {
    const { date, selectedTime, description, type, typeLength } = ctx.session;
    const y = selectedTime.split(':').map((r) => +r);
    const time = {
      timeStart: y[0],
      timeEnd: y[0] + typeLength,
    };

    try {
      return {
        isCreated: await this.prismaService.db.$transaction(
          async (tx) => {
            const isOverlapping = await this.prismaService.db.time.findFirst({
              where: {
                timeStart: {
                  lt: time.timeStart,
                },
                timeEnd: {
                  gt: time.timeEnd,
                },
              },
              select: { id: true },
            });
            if (isOverlapping) throw new Error(`Просим прощения но вы не успели забронировать слот на ${time}.`);
            console.log('Все нормально, время можно бронировать');

            let existingDate = await tx.date.findFirst({
              where: { date: new Date(date) },
            });
            if (!existingDate)
              existingDate = await tx.date.create({
                data: {
                  date: new Date(date),
                },
              });

            await tx.record.create({
              data: {
                //todo: sort out the schema
                serviceType: type,
                serviceDescription: description,

                dateId: existingDate.id,
                userId: ctx.callbackQuery.from.id,
                time: {
                  create: {
                    timeSlot: selectedTime,
                    ...time,
                    version: 1,
                    isBooked: true,

                    dateId: existingDate.id,
                  },
                },
              },
            });

            console.log('Вермя забранировано успешно');
            return true;
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        ),
        error: null,
      };
    } catch (error) {
      if (error.message.includes('Cannot read properties of undefined'))
        error.message = 'Ошибка на сервере, мы не смогли добавить вашу запись';
      return { isCreated: null, error };
    }
  }

  async getBookings(userId: number): Promise<BookingsType[]> {
    try {
      const records = await this.prismaService.db.record.findMany({
        where: {
          userId,
        },

        include: {
          time: {
            select: {
              id: true,
              timeSlot: true,
            },
          },
          date: {
            select: {
              id: true,
              date: true,
            },
          },
        },
      });
      return records;
    } catch (error) {
      console.log(error);
    }
  }
  async getBookingsByDate(date: Date): Promise<BookingsTypeWithUser[]> {
    try {
      const records = await this.prismaService.db.date.findFirst({
        where: {
          date: new Date(date),
        },
        select: {
          record: {
            select: {
              id: true,
              serviceDescription: true,
              serviceType: true,
              isCompleted: true,
              time: {
                select: {
                  id: true,
                  timeSlot: true,
                },
              },
              date: {
                select: {
                  id: true,
                  date: true,
                },
              },
              user: {
                select: {
                  telegramId: true,
                  firstName: true,
                  secondName: true,
                },
              },
            },
          },
        },
      });
      if (!records) return [];
      return records.record;
    } catch (error) {
      console.log(error);
    }
  }
  async cancelBooking(ctx: TBotContext, ids: number[], isAdmin: boolean = false) {
    try {
      return await this.prismaService.db.$transaction(async (tx) => {
        for await (const id of ids) {
          console.log('Пытаемся удалить запись ', id);
          await tx.record.delete({
            where: { id: +id },
          });
          const rcds = ctx.session[isAdmin ? 'adminRecords' : 'records'];
          const idx = rcds.findIndex((v) => {
            v.id === id;
          });
          rcds.splice(idx, 1);
          if (isAdmin) {
            ctx.deleteMessage(ctx.session.adminMessages[idx]);
            ctx.session.adminMessages.splice(idx, 1);
          }
          console.log('Успешно удалили запись', id);
        }

        return true;
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

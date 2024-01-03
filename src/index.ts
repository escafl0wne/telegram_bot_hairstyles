import { Bot } from './bot.class';
import { UserService } from './user.service';
import { ConfigService } from './config/config.service';
import { PrismaService } from './prisma.service';
import { BookingService } from './booking.service';
import express from 'express';
// const app = express();
// app.get('/', (req, res) => {
//   res.send('HEY');
// });
// app.listen(3000, async () => {
//   console.log('Running service on port: 3000');
// });
const prismaService = new PrismaService();
const telegramBot = new Bot(new ConfigService(), new UserService(prismaService), new BookingService(prismaService));

telegramBot.init();

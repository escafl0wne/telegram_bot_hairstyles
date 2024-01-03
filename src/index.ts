import { Bot } from './bot.class';
import { UserService } from './user.service';
import { ConfigService } from './config/config.service';
import { PrismaService } from './prisma.service';
import { BookingService } from './booking.service';
import express from 'express';
const app = express();
app.get('/', (req, res) => {
  res.send('HEY');
});
const prismaService = new PrismaService();
const telegramBot = new Bot(new ConfigService(), new UserService(prismaService), new BookingService(prismaService));

app.use(
  telegramBot
    .getBot()
    .createWebhook({
      domain:
        'https://webhooks.amplify.eu-west-2.amazonaws.com/prod/webhooks?id=738107f7-f88a-465c-a5ea-44e76b246485&token=th5CBRutdK2q7yXJmKEe3n3Vn6AUlLSA1rGzJzH3LY',
    })
);
telegramBot.init();

app.listen(3000, async () => {
  console.log('Running service on port: 3000');
});

import { Service } from './commands/commands.class';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from './prisma.service';
import { UserResponseType } from './types';

export class UserService extends Service {
  private userFilter = {
    firstName: true,
    secondName: true,
    telegramId: true,
    recordId: {
      select: {
        id: true,
        serviceType: true,
        serviceDescription: true,
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
      },
    },
  };

  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getUserByID(telegramId: number): Promise<{ result: UserResponseType | null; err: Error }> {
    try {
      console.log('Getting user with id :: ', telegramId);
      const user = await this.prismaService.db.user.findUnique({
        where: { telegramId },
        select: this.userFilter,
      });
      if (!user) return { result: null, err: null };
      console.log('Returning user with id :: ', telegramId);
      return { result: user, err: null };
    } catch (error) {
      console.log(error);
      return { result: null, err: error.message };
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<{ result: UserResponseType; err: Error }> {
    try {
      console.log('Creating user with id :: ', createUserDto.id);
      const user = await this.prismaService.db.user.create({
        data: {
          telegramId: createUserDto.id,
          firstName: createUserDto.first_name,
          secondName: createUserDto.last_name,
        },
        select: this.userFilter,
      });
      console.log('User with id :: ', createUserDto.id + ' was created OK');
      return { result: user, err: null };
    } catch (error) {
      console.log(error);
      return { result: null, err: error.message };
    }
  }
}

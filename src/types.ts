import { Context } from 'telegraf';
import { SESSION_MESSAGES } from './lib/constats';

export type PhotoSession = 'haircuts' | 'dying' | 'hairstyle';

export type BookTimeType = {
  id: number;
  timeSlot: String;
  date: Date;
  recordId: number;
  version: number;
};
export type RecordType = {
  bookedDate: {
    bookedDate: Date;
  };
  serviceType: string;
  isCompleted: boolean;
  bookedTime: string;
};

export type TimeSlot = {
  timeStart: number;
  timeEnd: number;
  timeSlot: string;
};
export type sessionMessagesType = keyof typeof SESSION_MESSAGES;
export type SessionData = {
  user: UserResponseType;
  records: BookingsType[];
  type: PhotoSession;
  typeLength: number;
  selectedTime: string;
  description: string;
  times: string[];
  date: Date;
  messageId: number;
  stage: string;
  timeSlots: TimeSlot[];
  messages: Record<sessionMessagesType, number>;
} & {
  adminRecords: BookingsTypeWithUser[];
  adminMessages: number[];
  adminCancelResponseMessage: number;
};

type ExtractTypes<Obj, typeVal> = {
  [K in keyof Obj]: Obj[K] extends typeVal ? K : never;
};

type ValuesOf<T> = T[keyof T];

export type TBotContext = Context & {
  session: SessionData;
};
export type ContentActions = {
  title: string;
  content: string;
  description: string;
  alias: string;
  time: number;
};
export type UserResponseType = {
  firstName: string;
  secondName: string;
  telegramId: number;
  recordId: BookingsType[];
};
export type BookingsType = {
  id: number;
  serviceDescription: string;
  serviceType: string;
  isCompleted: boolean;
  date: {
    id: number;
    date: any;
  };
  time: {
    id: number;
    timeSlot: string;
  };
};
export type BookingsTypeWithUser = BookingsType & {
  user: { telegramId: number; firstName: string; secondName: string };
};

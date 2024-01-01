export class CreateBookingDto {
  bookedDate: Date;
  timeStart: Date;
  timeEnd: Date;
  bookedTimeId: number;
  userId: number;
  serviceType: string;
}

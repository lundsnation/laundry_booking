import mongoose, {HydratedDocument, Model} from 'mongoose'
import {LaundryBuilding} from "../../configs/Config";

export interface IBooking {
    user_id: string;
    username: string;
    timeSlot: string;
    dryingBooth: number;
    laundryBuilding: string;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
}


interface IBookingMethods {
    // Can be used to add methods to the document
}

export interface IBookingModel extends Model<IBooking, {}, IBookingMethods> {
    findBookingsPostDate(date: Date): Promise<BookingDocument[]>

    findBookingsByLaundryBuildingAndPostDate(laundryBuilding: LaundryBuilding, date: Date): Promise<BookingDocument[]>
}

export type BookingDocument = HydratedDocument<IBooking, IBookingMethods>


export const BookingSchema = new mongoose.Schema<IBooking, IBookingModel>(
    {
        user_id: {type: String, required: true},
        username: {type: String, required: true},
        timeSlot: {type: String, required: true},
        dryingBooth: {type: Number, required: true},
        laundryBuilding: {type: String, required: true},
        startTime: {type: Date, required: true},
        endTime: {type: Date, required: true},
        createdAt: {type: Date, required: true},
    },
    {
        autoIndex: true, // Explicitly enable autoIndex
        methods: {},
        statics: {
            findBookingsPostDate(date: Date) {
                return this.find({startTime: {$gte: date}});
            },
            findBookingsByLaundryBuildingAndPostDate(laundryBuilding: LaundryBuilding, date: Date) {
                return this.find({laundryBuilding: laundryBuilding, startTime: {$gte: date}});
            },
        },
    }
);

// Ensures that there can only be one booking per time slot and laundry building
BookingSchema.index({startTime: 1, laundryBuilding: 1}, {unique: true});

const MongooseBooking = mongoose.models.Booking as IBookingModel || mongoose.model<IBooking, IBookingModel>("Booking", BookingSchema)

export default MongooseBooking;
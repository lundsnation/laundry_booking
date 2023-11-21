import mongoose, {HydratedDocument, Model} from 'mongoose'

export interface IBooking {
    userName: string,
    date: Date,
    timeSlot: string,
    createdAt: Date,
}

interface IBookingMethods {
    getBuilding(): string,
}

export interface IBookingModel extends Model<IBooking, {}, IBookingMethods> {
    findBookingsAfterDate(date: Date): Promise<BookingDocument[]>
}

export type BookingDocument = HydratedDocument<IBooking, IBookingMethods>


export const BookingSchema = new mongoose.Schema<IBooking, IBookingModel>(
    {
        userName: {type: String, required: true},
        date: {type: Date, required: true},
        timeSlot: {type: String, required: true},
        createdAt: {type: Date, required: true},
    },
    {
        methods: {
            getBuilding() {
                const building = this.userName.replace(/[^a-zA-Z]/g, "");
                if (["A", "B", "C", "D"].includes(building)) return "ARKIVET";
                if (["NH", "GH", "admin"].includes(building)) return "NATIONSHUSET";
                return "UNKNOWN";
            },
        },
        statics: {
            findBookingsAfterDate(date: Date) {
                return this.find({date: {$gte: date}});
            },

            findBookingsByBuildingAndAfterDate(date: Date, building: string) {
                //Går det att skriva en sådan metod?
            },
        },
    }
);


BookingSchema.index({userName: 1, date: 1}, {unique: true});

const MongooseBooking = mongoose.models.Booking as IBookingModel || mongoose.model<IBooking, IBookingModel>("Booking", BookingSchema)

export default MongooseBooking;
import mongoose, {HydratedDocument, Model} from 'mongoose'

console.log(mongoose.version)

export interface IBooking {
    userName: string,
    date: Date,
    timeSlot: string,
    createdAt: Date,

    getBuild(): string []

}

interface IBookingMethods {
    getBuilding(): string,
}

interface IBookingModel extends Model<IBooking, {}, IBookingMethods> {
    findBookingsAfterDate(date: Date): HydratedDocument<IBooking, IBookingMethods>
}

const BookingSchema = new mongoose.Schema<IBooking, IBookingModel>(
    {
        userName: String,
        date: Date,
        timeSlot: String,
        createdAt: Date,
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

const Booking = mongoose.models.Booking as IBookingModel || mongoose.model<IBooking, IBookingModel>("Booking", BookingSchema)

//const Booking = mongoose.model<IBooking, IBookingModel>("Booking", BookingSchema)
// Lyckas inte lägga till statiska metoder :/

export default Booking;
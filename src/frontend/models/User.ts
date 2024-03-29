import Booking from "./Booking";
import {Building, LaundryBuilding} from "../configs/Config";


type AppMetadata = {
    acceptedTerms: boolean,
    allowedSlots: number,
    roles: string[],
    building: Building,
    apartment: string, // Room/apartment nbr. Can contain letters, e.g. "0000a" when multiple users share apartment.
    laundryBuilding: LaundryBuilding
}

type UserMetadata = {
    picture: string,
    telephone: string
}

export type JsonUser = {
    sub: string, // user id, called sub in auth0
    name: string,
    nickname: string,
    email: string,
    email_verified: boolean,
    picture: string,
    app_metadata: AppMetadata,
    user_metadata: UserMetadata,
    updated_at: string
}

export type NewUser = {
    name: string,
    email: string,
    connection: string,
    password: string,
    email_verified: boolean,
    app_metadata: AppMetadata,
    user_metadata: {
        telephone: string
    },
}

//EditUser type is in  editSingleUserDialog.tsx since it is only used there

export interface UserProfileUpdate {
    email: string;
    user_metadata: {
        telephone: string;
    };
}

// Send username and laundryBuilding to check for existing users in the same building
export interface UserUpdate {
    name: string,
    email?: string,
    user_metadata?: {
        telephone?: string,
    },
    app_metadata: {
        acceptedTerms?: boolean,
        allowedSlots?: number,
        building?: Building,
        apartment?: string,
        laundryBuilding: LaundryBuilding,
    },
}

export type UserBookingInfo = {
    name: string,
    email: string,
    user_metadata: {
        telephone: string
    },
}

class User {
    readonly sub: string // user id, called sub in auth0
    readonly name: string
    readonly nickname: string
    readonly email: string
    readonly email_verified: boolean
    readonly picture: string
    app_metadata: AppMetadata
    readonly user_metadata: UserMetadata
    readonly updated_at: Date
    readonly activeBookings: Booking[] = []
    readonly pastBookings: Booking[] = []

    constructor(user: JsonUser, bookings: Booking[] = []) {
        this.sub = user.sub
        this.name = user.name
        this.nickname = user.nickname
        this.email = user.email
        this.email_verified = user.email_verified
        this.picture = user.picture
        this.app_metadata = user.app_metadata
        this.user_metadata = user.user_metadata
        this.updated_at = new Date(user.updated_at)

        bookings.forEach(bookings => {
            if (bookings.startTime > new Date() && bookings.username === this.name) {
                this.activeBookings.push(bookings)
            }
            if (bookings.startTime < new Date() && bookings.username === this.name) {
                this.pastBookings.push(bookings)
            }
        })
    }

    toJSON() {
        return {
            sub: this.sub,
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            email_verified: this.email_verified,
            picture: this.picture,
            app_metadata: this.app_metadata,
            user_metadata: this.user_metadata,
            updated_at: this.updated_at.toISOString()
        }
    }

    setUserBookings(bookings: Booking[]) {
        this.pastBookings.length = 0 // clears the array
        this.activeBookings.length = 0 // clears the array

        bookings.forEach(bookings => {
            if (bookings.startTime > new Date() && bookings.username === this.name) {
                this.activeBookings.push(bookings)
            }
            if (bookings.startTime < new Date() && bookings.username === this.name) {
                this.pastBookings.push(bookings)
            }
        })
    }

    hasBookingOnDay(day: Date): boolean {
        return this.activeBookings.some(booking => booking.isSameDay(day));
    }

    //Can be used in a future refactor to determine if the user has admin rights
    isAdmin(): boolean {
        return this.app_metadata.roles.includes('admin');
    }
}

export default User
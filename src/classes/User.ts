import Booking from "./Booking";

type AppMetadata = {
    acceptedTerms: boolean,
    allowedSlots: number,
    roles: string[]
}

type UserMetadata = {
    picture: string,
    telephone: string
}

export type JsonUser = {
    sub: string,
    name: string,
    nickname: string,
    email: string,
    email_verified: boolean,
    picture: string,
    app_metadata: AppMetadata,
    user_metadata: UserMetadata,
    updated_at: string
}

class User {
    readonly id: string
    readonly name: string
    readonly nickname: string
    readonly email: string
    readonly email_verified: boolean
    readonly picture: string
    readonly app_metadata: AppMetadata
    readonly user_metadata: UserMetadata
    readonly updated_at: Date
    readonly activeBookings: Booking[] = []
    readonly pastBookings: Booking[] = []

    constructor(user: JsonUser, userBookings: Booking[] = []) {
        this.id = user.sub
        this.name = user.name
        this.nickname = user.nickname
        this.email = user.email
        this.email_verified = user.email_verified
        this.picture = user.picture
        this.app_metadata = user.app_metadata
        this.user_metadata = user.user_metadata
        this.updated_at = new Date(user.updated_at)
        this.activeBookings = userBookings.filter(booking => !booking.hasPassed())
        this.pastBookings = userBookings.filter(booking => booking.hasPassed())
    }

    get building(): string {
        const building = this.name.replace(/[^a-zA-Z]/g, "")
        if (["A", "B", "C", "D"].includes(building)) return "ARKIVET"
        if (["NH", "GH", "admin"].includes(building)) return "NATIONSHUSET"
        return "UNKNOWN"
    }

    toJSON() {
        return {
            id: this.id,
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
}

export default User
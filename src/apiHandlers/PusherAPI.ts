import Pusher from 'pusher'
import PusherClient from 'pusher-js'
import {Channel} from 'pusher-js'
import {LaundryBuilding} from "../configs/Config";

const {PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER} = process.env

const backendOptions = {
    appId: PUSHER_APP_ID as string,
    key: PUSHER_KEY as string,
    secret: PUSHER_SECRET as string,
    cluster: PUSHER_CLUSTER as string,
    useTLS: true,
};

export const bookingUpdateEvent = 'bookingUpdate'
export const bookingUpdateChannel = 'bookingUpdates'

export type BookingUpdate = {
    username: string,
    timeSlot: string,
    startTime: Date,
    method: BookingUpdateMethod
}

enum BookingUpdateMethod {
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}


// --- Backend Pusher ---
export class BackendPusher extends Pusher {
    constructor() {
        super(backendOptions);
    }

    bookingUpdateTrigger(laundryBuilding: LaundryBuilding, bookingUpdate: BookingUpdate): Promise<Pusher.Response> {
        return super.trigger(bookingUpdateChannel + "_" + laundryBuilding, bookingUpdateEvent, bookingUpdate);
    }

    get bookingUpdateMethod() {
        return BookingUpdateMethod
    }
}

// --- Frontend Pusher ---
const frontendOptions = {
    cluster: "eu",
    forceTLS: true
}

export class FrontendPusher extends PusherClient {
    private _bookingUpdateChannel: string
    private _bookingUpdateEvent: string
    private _laundryBuilding: LaundryBuilding

    constructor(laundryBuilding: LaundryBuilding) {
        super(process.env.REACT_APP_PUSHER_KEY as string, frontendOptions)
        this._bookingUpdateChannel = bookingUpdateChannel;
        this._bookingUpdateEvent = bookingUpdateEvent;
        this._laundryBuilding = laundryBuilding
    }

    bookingUpdatesSubscribe(): Channel {
        return super.subscribe(bookingUpdateChannel + "_" + this._laundryBuilding)
    }

    get bookingUpdateMethod() {
        return BookingUpdateMethod
    }

    get bookingUpdateChannel() {
        return this._bookingUpdateChannel
    }

    get bookingUpdateEvent() {
        return this._bookingUpdateEvent
    }

    cleanup(): void {
        super.unbind(bookingUpdateEvent);
        super.unsubscribe(bookingUpdateChannel + "_" + this._laundryBuilding);
        super.disconnect();
    }
}


/**
 export class BookingUpdateChannel extends Channel {
 constructor(frontendPusher: FrontendPusher) {
 super(bookingUpdateEvent, frontendPusher)
 }

 bookingUpdateBind(callback: (data: BookingUpdate) => void) {
 return super.bind(bookingUpdateEvent, callback)
 }
 }
 **/

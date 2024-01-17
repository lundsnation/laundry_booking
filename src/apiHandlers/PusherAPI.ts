import Pusher from 'pusher'
import PusherClient from 'pusher-js'
import {Channel} from 'pusher-js'

const {PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER} = process.env

const backendOptions = {
    appId: PUSHER_APP_ID as string,
    key: PUSHER_KEY as string,
    secret: PUSHER_SECRET as string,
    cluster: PUSHER_CLUSTER as string,
    useTLS: true,
};

export const bookingUpdateChannel = 'bookingUpdates'
export const bookingUpdateEvent = 'bookingUpdate'

export type BookingUpdate = {
    userName: string,
    date: Date,
    timeSlot: string,
    method: BookingUpdateMethod
}

enum BookingUpdateMethod {
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export class BackendPusher extends Pusher {
    constructor() {
        super(backendOptions);
    }

    bookingUpdateTrigger(building: String, bookingUpdate: BookingUpdate): Promise<Pusher.Response> {
        return super.trigger(building + bookingUpdateChannel, bookingUpdateEvent, bookingUpdate);
    }

    get bookingUpdateMethod() {
        return BookingUpdateMethod
    }
}

const frontendOptions = {
    cluster: "eu",
    forceTLS: true
}

export class FrontendPusher extends PusherClient {
    private _bookingUpdateChannel: string
    private _bookingUpdateEvent: string

    constructor() {
        super(process.env.REACT_APP_PUSHER_KEY as string, frontendOptions)
        this._bookingUpdateChannel = bookingUpdateChannel;
        this._bookingUpdateEvent = bookingUpdateEvent;
    }

    bookingUpdatesSubscribe(building: string): Channel {
        return super.subscribe(building + bookingUpdateChannel)
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
        super.unbind("bookingUpdate");
        super.unsubscribe("bookingUpdates");
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

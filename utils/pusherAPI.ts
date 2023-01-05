import Pusher from 'pusher'
import PusherClient from 'pusher-js'

const {PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER} = process.env

export const pusherBackend = new Pusher({
    appId: PUSHER_APP_ID as string,
    key: PUSHER_KEY as string,
    secret: PUSHER_SECRET as string,
    cluster: PUSHER_CLUSTER as string,
    useTLS: true,
  });


//Borde ändra "EU" så den inte är hårdkodad.
export const pusherClient = new PusherClient(process.env.REACT_APP_PUSHER_KEY as string, {
    cluster: "eu",
    forceTLS: true
  })
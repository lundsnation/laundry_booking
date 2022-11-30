import Pusher from 'pusher'

export const pusherInfo = {
        channelName : "updateRT",
        eventName: "notify"
}

export const realTimePusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_CLUSTER as string, 
    encrypted: true
  });
import mongoose from 'mongoose'

//Potential todo list:
//Add method for logging responses?
//Add logging for unknown requests

//Constants for controlling logging
const LOGEVENTS = true;
const DEBUGEVENTS = false;
const LOGREQUESTS = true;
//const writeToFile = false; //add writeToFile functionality

//Logs events when added to mongoose/Bookings.ts
export const addEventLogging = () => {
    //0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    //const HEADER = "[ TYPE \t something ] Can be added later if logging to file will be used and for further clarity

    if (LOGEVENTS) {
        DEBUGEVENTS && console.log('[ readyStates: { 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting } ]')
        DEBUGEVENTS && console.log("readyState:" + mongoose.connection.readyState); //logs 0

        mongoose.connection.on('connecting', () => {
            console.log('LOGGER: [ Connecting to database! \t\t' + (new Date()).toLocaleString() + " ]")
            DEBUGEVENTS && console.log("readyState:" + mongoose.connection.readyState); //logs 2
        });

        mongoose.connection.on('connected', () => {
            console.log('LOGGER: [ Connected to database! \t\t' + (new Date()).toLocaleString() + " ]")
            DEBUGEVENTS && console.log("readyState:" + mongoose.connection.readyState); //logs 1
        });

        mongoose.connection.on('disconnecting', () => {
            console.log('LOGGER: [ Disconnecting from database! \t\t' + (new Date()).toLocaleString() + " ]")
            DEBUGEVENTS && console.log("readyState:" + mongoose.connection.readyState); // logs 3
        });

        mongoose.connection.on('disconnected', () => {
            console.log('LOGGER: [ Disconnected from database! \t\t' + (new Date()).toLocaleString() + " ]")
            DEBUGEVENTS && console.log("readyState:" + mongoose.connection.readyState); //logs 0
        });
    }
}

//Logs requests when added to [ID].ts and index.ts in pages/api/bookings/
export const logRequest = (method: string) => {
    if (LOGREQUESTS) {
        switch (method) {
            case 'GET':
            case 'PUT':
                console.log("LOGGER: [ Received " + method + " request \t\t\t" + new Date().toLocaleString() + " ]")
                break;
            case 'POST':
            case 'GET_ID':
            case 'DELETE':
                console.log("LOGGER: [ Received " + method + " request \t\t" + new Date().toLocaleString() + " ]")
                break;

            default:
                console.log("LOGGER: [ Received unknown " + method + " request \t\t" + new Date().toLocaleString() + " ] ")
        }
    }
}


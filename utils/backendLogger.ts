import mongoose from 'mongoose'

const debug = false;

//Create DbLogger with write to file functionality and make global values for writeFile like in DATABASE_URL and exapnd for all api endpoints add header format


export const addEventLogging = () => {
    //0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  
  //const HEADER = "[ TYPE \t something ] Can be added later if logging to file will be used

  
    debug && console.log('[ readyStates: { 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting } ]')
    debug && console.log("readyState:" + mongoose.connection.readyState); //logs 0
  
    mongoose.connection.on('connecting', () => {  
        console.log('LOGGER: [ Connecting to database! \t\t' + (new Date()).toLocaleString() + " ]")
        debug && console.log("readyState:" + mongoose.connection.readyState); //logs 2
    });
  
    mongoose.connection.on('connected', () => {
        console.log('LOGGER: [ Connected to database! \t\t' + (new Date()).toLocaleString() + " ]")  
        debug && console.log("readyState:" + mongoose.connection.readyState); //logs 1
    });
  
    mongoose.connection.on('disconnecting', () => {
        console.log('LOGGER: [ Disconnecting from database! \t\t' + (new Date()).toLocaleString() + " ]")  
        debug && console.log("readyState:" + mongoose.connection.readyState); // logs 3
    });
  
    mongoose.connection.on('disconnected', () => {
        console.log('LOGGER: [ Disconnected from database! \t\t' + (new Date()).toLocaleString() + " ]")  
        debug && console.log("readyState:" + mongoose.connection.readyState); //logs 0
    });
}

export const logRequest = (method: string) => {

switch(method) {
    case 'GET':
    case 'POST':
    case 'PUT':
    case 'DELETE':
    console.log("LOGGER: [Received " + method + " request \t\t" + new Date().toLocaleString() + "]")
    break;

    default:
    console.log("LOGGER: [ Receved unknown " + method + " request \t\t" + new Date().toLocaleString() + "]")
} 
}
  
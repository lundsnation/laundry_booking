//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DATABASE_URL } = process.env


/**const logReadyState() => {
  if(mongoose.connection.readyState) == 0) {

  }
}**/
//Create DbLogger with write to file functionality and make global values for writeFile like in DATABASE_URL and exapnd for all api endpoints add header format
export const logRequest = (method: string) => {
  //0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
// Demonstrate the readyState and on event emitters

  switch(method) {
    case 'GET':
    case 'POST': 
      console.log("LOGGER: [Received " + method + " request \t\t" + new Date().toLocaleString() + "]")
      break;

    default:
      console.log("LOGGER: [ Receved unknown " + method + " request \t\t" + new Date().toLocaleString() + "]")
  } 
}



// connection function
export const connect = async () => {

  //if(mongoose.connection.readyState == 0) {
  //  logDb();
  //}

  const conn = await mongoose
    .connect((DATABASE_URL as string))
    .catch(err => console.log(err))
  
  console.log("--------")

  
  return { conn }
}
//IMPORT MONGOOSE
import mongoose from "mongoose"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const {DATABASE_URL} = process.env

// connection function
export const connect = async () => {

    const conn = await mongoose
        .connect((DATABASE_URL as string))
        .catch(err => {
            console.log("Error connecting to database: ", err)
            throw err
        })

    return {conn}
}
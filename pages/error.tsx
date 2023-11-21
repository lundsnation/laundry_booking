import HttpError from "../src/backend/errors/HttpError";

import {useEffect} from 'react'
import Booking from "../src/classes/Booking";

type ErrorProps = {
    error: HttpError & { digest?: string }
    reset: () => void;
};


export default function Error({error, reset}: ErrorProps) {

    useEffect(() => {
        console.error(error)
    }, [error])

    switch (error.name) {
        case 'HttpError':
            return (
                <div className="grid h-screen px-4 bg-white place-content-center">
                    <div className="text-center">
                        <h1 className="font-black text-gray-200 text-9xl">{error.statusCode}</h1>

                        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Error!
                        </p>

                        <p className="mt-4 text-gray-500">
                            {error.message || "You must be logged in to access the page"}
                        </p>

                        <button
                            type="button"
                            onClick={() => reset()}
                            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );

        default:
            return (
                <div className="grid h-screen px-4 bg-white place-content-center">
                    <div className="text-center">
                        <p className="mt-4 text-gray-500">
                            {error.message || "You must be logged in to access the page"}
                        </p>

                        <button
                            type="button"
                            onClick={() => reset()}
                            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
    }
}
/**
 const handleBook = async () => {
 //setDisabled(true)
 const booking = new Booking(user.name as string, date, timeSlot);

 try {
 const response = await booking.POST();

 if (response.ok) {
 snackString = "Du har bokat: " + String(timeSlot);
 snackTrigger("success", snackString, snackAlignment);
 } else {
 const responseContent = await response.json();
 snackString = responseContent.error;
 console.log(snackString)
 snackTrigger("error", snackString, snackAlignment);
 throw Error(responseContent.error);
 }
 } catch (error) {
 console.error("Error creating booking:", error);
 // Handle any errors during the POST request
 snackString = "An error occurred while creating booking";
 snackTrigger("error", snackString, snackAlignment);
 throw new Error(error);
 }

 handleOpenConfirmation(false);
 //setDisabled(false)
 };
 */
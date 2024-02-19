const LOGREQUESTS = true;

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


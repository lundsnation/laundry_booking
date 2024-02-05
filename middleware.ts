import type {NextRequest} from 'next/server'
import {logRequest} from "./src/backend/backendLogger";


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    logRequest(request.method)
    console.log("Request url", request.url)
}
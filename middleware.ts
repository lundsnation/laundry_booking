import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {logRequest} from "./utils/backendLogger";


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    logRequest(request.method)
}
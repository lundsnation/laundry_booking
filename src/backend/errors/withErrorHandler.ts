import {NextApiRequest, NextApiResponse} from "next"
import HttpError from "./HttpError";
import * as Sentry from "@sentry/nextjs";


//async (req: NextApiRequest, res: NextApiResponse)
interface IFunction {
    (req: NextApiRequest, res: NextApiResponse): Promise<any>;
}

function withErrorHandler(fn: IFunction) {
    return async function async(req: NextApiRequest, res: NextApiResponse) {

        try {
            return await fn(req, res);
        } catch (error) {
            //Log error to Sentry
            Sentry.captureException(error);
            console.log(error)
            if (error instanceof HttpError) {
                return res.status(error.statusCode).json({error: error.message})
            }

            if (error instanceof Error) {
                return res.status(500).json({error: `Internal server error, ${error.message}`});
            }

            return res.status(500).json({error: "Internal server error"});
        }
    };
}


export default withErrorHandler;
import {NextApiRequest, NextApiResponse} from "next"
import HttpError from "./HttpError";

//async (req: NextApiRequest, res: NextApiResponse)
interface IFunction {
    (req: NextApiRequest, res: NextApiResponse): Promise<any>;
}

function withErrorHandler(fn: IFunction) {
    return async function async(req: NextApiRequest, res: NextApiResponse) {
        try {
            return await fn(req, res);
        } catch (error) {
            //Log error
            console.log(error)
            if (error instanceof HttpError) {
                return res.status(error.statusCode).json({error: error.message})
            }

            //Catch all
            return res.status(500).json({error: "Internal server error"})
        }
    };
}


export default withErrorHandler;
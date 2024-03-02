import React from "react";
import {AxiosError} from "axios";

/*
    * This hook is used to handle errors in async functions.
    * By using this hook, the error will be propagated to the error boundary, where it will be handled.
 */
const useAsyncError = () => {
    const [_, setError] = React.useState();
    return React.useCallback(
        (e: AxiosError | Error) => {
            setError(() => {
                throw e;
            });
        },
        [setError],
    );
};

export default useAsyncError;
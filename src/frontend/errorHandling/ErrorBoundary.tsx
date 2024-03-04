import React, {Component, ErrorInfo} from 'react';
import ErrorSnack from "./ErrorSnack";
import Button from '@mui/material/Button';
import axios, {AxiosError} from 'axios';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | AxiosError | null;
    isServerError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            isServerError: false,
        };
    }

    componentDidCatch(error: Error | AxiosError, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error: ', error, errorInfo);

        let isServerError = false;

        if (axios.isAxiosError(error)) {
            isServerError = true;
        }

        this.setState({
            hasError: true,
            error,
            isServerError,
        });

        // Send error to Sentry
        //Sentry.captureException(error);
    }

    resetError = () => {
        this.setState({hasError: false, error: null, isServerError: false});
    };

    renderErrorMessage = () => {
        const {error, isServerError} = this.state;
        if (!error) return "Something went wrong";

        if (isServerError && axios.isAxiosError(error)) {
            // If the error is from Axios and contains a response, display the server-provided message
            return error.response?.data.error || "An error occurred on the server";
        }

        // Fallback for non-Axios errors or Axios errors without a response
        return error.message || "An unknown error occurred";
    };

    render() {
        const {hasError, isServerError} = this.state;

        if (hasError) {
            if (isServerError) {
                // Use ErrorSnack for server errors
                return (
                    <React.Fragment>
                        <ErrorSnack message={this.renderErrorMessage()}/>
                        {this.props.children}
                    </React.Fragment>
                );
            } else {
                // Render a generic error fallback UI for non-server errors
                return (
                    <React.Fragment>
                        <h1>Something went wrong.</h1>
                        <h2>Error Message: {this.renderErrorMessage()}</h2>
                        <h2>Contact system administrator for help</h2>
                        <Button onClick={this.resetError} variant="contained" color="primary">
                            Retry
                        </Button>
                    </React.Fragment>
                );
            }
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

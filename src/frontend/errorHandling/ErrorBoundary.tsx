import React, {Component, ErrorInfo} from 'react';
import ErrorSnack from "./ErrorSnack";
import Button from '@mui/material/Button';
import axios, {AxiosError} from 'axios';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string | null;
    isServerError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        
        this.state = {
            hasError: false,
            errorMessage: null,
            isServerError: false,
        };
    }

    componentDidCatch(error: Error | AxiosError, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error: ', error, errorInfo);

        let isServerError = false;
        let errorMessage = 'Something went wrong.';

        if (axios.isAxiosError(error)) {
            isServerError = true;
            errorMessage = error.message || errorMessage;
        } else {
            errorMessage = error.message;
        }

        this.setState({
            hasError: true,
            errorMessage,
            isServerError,
        });
    }

    resetError = () => {
        this.setState({hasError: false, errorMessage: null, isServerError: false});
    };

    render() {
        //Errors thrown by asyncError will be propagated to here
        if (this.state.isServerError) {
            return (
                <React.Fragment>
                    <ErrorSnack message={this.state.errorMessage || "Something went wrong"}/>
                    {this.props.children}
                </React.Fragment>
            );
        }

        if (this.state.hasError) {
            return (
                <React.Fragment>
                    <h1>Something went wrong. </h1>
                    <h1>Error Message: {this.state.errorMessage || "Unknown Error"}</h1>
                    <h1>Contact system administrator for help</h1>
                    <Button onClick={this.resetError} variant="contained" color="primary">
                        Retry
                    </Button>
                </React.Fragment>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

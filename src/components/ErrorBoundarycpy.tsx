import React, {Component, ErrorInfo} from 'react';
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

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error: ', error, errorInfo);


        let isServerError = false;
        let axiosError: AxiosError | undefined;

        if (axios.isAxiosError(error)) {
            isServerError = true;
            axiosError = error as AxiosError;
        }

        this.setState({
            hasError: true,
            errorMessage: error.message || 'Something went wrong.',
            isServerError,
        });
    }

    resetError = () => {
        this.setState({hasError: false, errorMessage: null, isServerError: false});
    };

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Something went wrong. If this unexpected behaviour, contact system administrator.</h1>
                    {this.state.errorMessage && (
                        <div>
                            <p>{this.state.errorMessage}</p>
                            {this.state.isServerError && (
                                <p>This is a server-side error.</p>
                            )}
                            <Button onClick={this.resetError} variant="contained" color="primary">
                                Reset
                            </Button>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from "./App";

export const app = (options) => {
    console.log(options);

    const div = document.createElement('div');
    const unmountModal = () => ReactDOM.unmountComponentAtNode(div);

    const onCompleteWrapper = (x) => {
        if (onComplete) {
            onComplete(x);
        }
        unmountModal();
    };

    const onCancelWrapper = (x) => {
        if (onCancel) {
            onCancel(x);
        }
        unmountModal();
    };

    const { filedata, onComplete, onCancel } = Object.assign({}, options);

    ReactDOM.render(<App filedata={filedata} onComplete={onCompleteWrapper} onCancel={onCancelWrapper} />, div);

};



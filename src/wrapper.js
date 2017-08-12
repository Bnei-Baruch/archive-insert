import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from "./App";

export const showModal = (options) => {
    console.log(options);

    const div = document.createElement('div');
    const unmountModal = () => ReactDOM.unmountComponentAtNode(div);

    const closeWrapper = (x) => {
        if (onComplete) {
            onComplete(x);
        }
        unmountModal();
    };

    const { metadata, onComplete, onCancel } = Object.assign({}, options);

    ReactDOM.render(<App metadata={metadata} onComplete={closeWrapper} />, div);

};

// module.exports = showModal;


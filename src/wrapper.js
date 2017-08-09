import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from "./App";

export const showModal = (options) => {
    console.log(options);
    const { metadata, onComplete, onCancel } = Object.assign({}, options);
    console.log(metadata);
    const div = document.createElement('div');
    ReactDOM.render(<App metadata={metadata} onComplete={onComplete} />, div);

};

// module.exports = showModal;


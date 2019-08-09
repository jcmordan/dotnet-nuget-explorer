import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import './index.scss';

// declare let settings: any;

console.log((Window as any).settings);

ReactDOM.render(
    <App defaultItems={20} />,
    document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import '@rmwc/data-table/data-table.css';


ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
  ,
    document.getElementById('root'));
registerServiceWorker();

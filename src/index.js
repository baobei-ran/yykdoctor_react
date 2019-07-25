import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import './utlis/rem';
import './index.css';
import 'antd-mobile/dist/antd-mobile.css'; 
import './assets/css/flex.css';
import './app.scss';
import Routers from './router/index'

import * as serviceWorker from './serviceWorker';

ReactDOM.render( <Routers />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

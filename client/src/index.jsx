import React from 'react';
import { render } from 'react-dom';

import Main from "./components/Main.jsx"
import Theme from "./components/Theme.jsx"

import './styles/main.css';

render(
    <Theme>
        <Main />
    </Theme>
    , document.getElementById('root'));

module.hot.accept();
import React from 'react';
import { render } from 'react-dom';

import Main from "./components/Main.jsx"

import './styles/main.css';

render(<Main />, document.getElementById('root'));

module.hot.accept();
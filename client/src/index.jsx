import React from 'react';
import { render } from 'react-dom';

import Editor from './XTerm.jsx';

import './main.css';

render(<Editor />, document.getElementById('root'));

module.hot.accept();
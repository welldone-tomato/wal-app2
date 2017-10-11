/*import React from 'react';
import {App} from '../../client/components';
// import ReactDOM from 'react-dom';
// ReactDOM.render(<App />, document.getElementById('root'));
// update for new version of REACT
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));
*/


import React from 'react';
import {hydrate as reactHydrate} from 'react-dom';
import {hydrate as emotionHydrate} from 'emotion';
import {App} from '../../client/components';

const {ids} = window.__data;

emotionHydrate(ids);
reactHydrate(<App />, document.getElementById('root'));

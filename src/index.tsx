import ReactDOM from 'react-dom';
import * as s1 from './styles.module.scss';
import * as s2 from './style.module.css';
console.log('s:', s1,s2);
import React, { useState } from 'react';

import('./a').then(({ a }) => {
  console.log(a);
})

function App() {
  return (
    <div className="app">
      <div
        style={{
          minHeight: 400,
          position: 'relative'
        }}
      >
        test
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

import './App.css';
import React, { useState } from 'react';
import DropZone from './components/drop-zone/drop-zone.component';

function App() {
    return (
        <div>
            <div className='content'>
                <DropZone />
            </div>
        </div>
    );
}

export default App;

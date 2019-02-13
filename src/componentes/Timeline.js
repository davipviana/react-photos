import React, { Component } from 'react';
import Photo from './Photo';
export default class Timeline extends Component {
    render = () => {
        return (
            <div className="fotos container">
                <Photo />
            </div>
        );
    }
}
import React,{ Component } from 'react';
import http from '../api/index'
class SetTime extends Component {
    constructor () {
        super ();
        this.state = {

        }
    }

    componentDidMount () {
        console.log(http)
    }

    render () {
        return (
            <div className='SetTime'>

            </div>
        )
    }
}

export default SetTime
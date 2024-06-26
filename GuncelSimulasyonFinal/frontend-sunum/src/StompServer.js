import React from 'react';
import SockJsClient from 'react-stomp';

class StompServer extends React.Component {
    constructor(props) {
        super(props);

    }
    clientRef = ""
    sendMessage = (msg) => {
        //this.clientRef.sendMessage('/ws/csv', msg);
    }



    render() {
        return (
            <div>
                <SockJsClient url='http://localhost:10100/our-websocket' topics={['/topics/csv']}
                              onMessage={(msg) => {  console.log(msg); }}
                              onConnect={  console.log("-")}

                              ref={ (client) => { this.clientRef = client }} />
            </div>
        );
    }
}export default StompServer;
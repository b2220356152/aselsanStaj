import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRClient = () => {
    const [connection, setConnection] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7045/myhub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log("-");
                    connection.on("/topics/csv", message => {
                        console.log(message);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = (msg) => {
        if (connection && connection.state === 'Connected') {
            connection.invoke("SendMessage", "/ws/csv", msg)
                .catch(err => console.error(err.toString()));
        }
    };

    clientRef.current = { sendMessage };

    return (
        <div>
            <button onClick={() => clientRef.current.sendMessage("Your message here")}>Send Message</button>
        </div>
    );
};

export default SignalRClient;

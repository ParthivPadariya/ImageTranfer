import React,{ useMemo } from 'react';
import {io} from 'socket.io-client'

const SocketContext = React.createContext(null);

export const useSocket = () => {
    return React.useContext(SocketContext);
}

export const SocketProvide = (props) => {
    const socket = useMemo(() => {
        return io('http://127.0.0.1:9001');
    },[])

    return(
        <SocketContext.Provider value={{socket}}>
            {props.children}
        </SocketContext.Provider>
    )
}
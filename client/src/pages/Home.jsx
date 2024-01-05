import React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/Socket";

const Home = () => {
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);

  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleRoomJoined = useCallback(

    ({ room }) => {
      if (room) {
        // console.log(room);
        navigate(`/${name}/${room}`);
      }
    },
    [navigate,name]
  );

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);

    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  const joinRoom = async () => {
    if (name && room) {
      await socket.emit("join-room", { name, room });
    }
    else{
      alert("Please Enter Valid Details")
    }
  };

  return (
    <div className="roomCard">
      <h1>Enter Room....</h1>
      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Enter Room"
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <button onClick={joinRoom}>Connect</button>
      <div className="footer" style={{position:"absolute", bottom:"0%"}}>
        <h4>Made By me</h4>
      </div>
    </div>

  );
};

export default Home;

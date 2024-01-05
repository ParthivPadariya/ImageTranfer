import React from 'react'
import { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import {useSocket} from '../contexts/Socket'

const User = () => {
  const params = useParams();
  const navigator = useNavigate()

  const [file,setFile] = useState(null);
  const [receivedImage, setReceivedImage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const {socket} = useSocket();

  const handleNewUserJoined = useCallback((data) => {
    const {name} = data;
    // console.log(data);
    console.log(`New User Joined ${name}`);
  },[])

  const downloadFile = useCallback((file) => {
    // console.log(file);
    try {
      
      setReceivedImage(`data:image/png;base64,${file}`);
      setDownloadLink(`data:image/png;base64,${file}`);
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Extracting base64 encoded string
        socket.emit('image', base64String); // Sending the image data to the server
      };
      // reader.readAsDataURL(file);
    } catch (error) {
      throw new Error("File Not Send")
    }
  },[socket])
  const disconnectUser = useCallback(() => {
    socket.disconnect();
    navigator("/");
  },[socket,navigator])

  useEffect(() => {
    socket.on('user-joined',handleNewUserJoined);
    socket.on('receive-file',downloadFile);
    socket.on('disconnect', disconnectUser);
    return () => {
      socket.off('user-joined',handleNewUserJoined);
      socket.off('receive-file',downloadFile);
      socket.off('disconnect', disconnectUser);
      
    }
  },[socket,handleNewUserJoined,downloadFile,disconnectUser])


  const sendData = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Extracting base64 encoded string
        socket.emit('send-file',{file:base64String,socketId: socket.id})
      };
      reader.readAsDataURL(file);
    }
  }

  const handleDownload = useCallback(() => {
    const element = document.createElement('a');
    element.href = downloadLink;
    element.download = 'received_image.png';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },[downloadLink]);

  return (
    <div className='user-section'>
      <h1 style={{marginTop:"50px"}}>user : {params.user}</h1>
      <div style={{margin:"30px"}}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={sendData}>Send</button>
      </div>
      <div className='display-image' style={{display:"flex", flexDirection:"column", width:"400px",height:"200px"}}>
        {receivedImage && <img src={receivedImage} alt="Received" />}
        {downloadLink && <button onClick={handleDownload}>Download</button>}
      </div>
    </div>
  )
}

export default User 
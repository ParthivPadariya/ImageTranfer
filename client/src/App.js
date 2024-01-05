import './App.css';
import {Route,Routes} from 'react-router-dom' 

import Home from './pages/Home'
import User from './pages/User'
import {SocketProvide} from './contexts/Socket'

function App() {
  return (
    <div className="App">
      <SocketProvide>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/:user/:roomId'  element={<User/>}></Route>
          </Routes>
      </SocketProvide>
    </div>
  );
}

export default App;

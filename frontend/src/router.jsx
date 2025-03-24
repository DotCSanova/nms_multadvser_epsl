import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import Streams from './views/Streams';

const AppRouter = () => {
  console.log('AppRouter cargado');  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/streams" element={<Streams />} />
        <Route path="/" element={<Register />} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;
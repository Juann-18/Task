import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'
import PrivateRoute from "./components/PrivateRoute.jsx";
import { InicioPages } from "./pages/InicioPages.jsx";
import { TaskPage } from "./pages/TaskPage.jsx";
import { DeleteTask } from "./pages/DeleteTask.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/inicio" element={<PrivateRoute><InicioPages /></PrivateRoute>}/>
        <Route path="/task" element={<PrivateRoute><TaskPage /></PrivateRoute>}/>
        <Route path="/Delete" element={<PrivateRoute><DeleteTask /></PrivateRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}
export default App;
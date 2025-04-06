import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import Swal from 'sweetalert2';
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        title: '¡Error!',
        text: 'Debes llenar todos los campos.',
        icon: 'error',
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      Swal.fire({
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente.',
        icon: 'success',
        confirmButtonText: 'Continuar'
      }).then(() => {
        navigate("/inicio");
      });

    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      Swal.fire({
        title: 'Error',
        text: error.message.includes('auth/user-not-found')
          ? 'El usuario no existe.'
          : error.message.includes('auth/wrong-password')
          ? 'Contraseña incorrecta.'
          : 'No se puede iniciar sesión.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  const handleAuthError = (errorCode) => {
    const errorMessages = {
      'auth/invalid-credential': "Correo o contraseña incorrectos",
      'auth/user-not-found': "El usuario no está registrado",
      'auth/wrong-password': "Contraseña incorrecta",
      'auth/invalid-email': "Correo no válido",
      'auth/user-disabled': "Este usuario ha sido deshabilitado",
    };
    
    Swal.fire({
      title: '¡Problemas!',
      text: errorMessages[errorCode] || 'Error desconocido',
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo.'
    });
  };

  return (
    <div className="container-login">
      <div className="card card-login">
        <div className="card-body card-body-login">
          <h1 className="text-center">Iniciar Sesión</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </div>
          </form>
          <p className="mt-3 text-center">
            ¿No tienes cuenta? <a href="/">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../styles/register.css'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const auth = getAuth();
  const db = getFirestore();

  const verificarNombreUnico = async (nombre) => {
    const q = query(collection(db, "usuarios"), where("name", "==", nombre));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const existeNombre = await verificarNombreUnico(name);
      if (existeNombre) {
        Swal.fire({
          icon: 'error',
          title: 'Nombre en uso',
          text: 'El nombre de usuario ya fue registrado por otro jugador.',
          confirmButtonText: 'OK'
        });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
      });

      
      
      Swal.fire({
        icon: "success",
        title: "Registrado",
        text: "Usuario registrado.",
        confirmButtonText: "OK",
      });
      
      navigate("/login");
    } catch (error) {
      handleAuthError(error.code);
    }
  };

  const handleAuthError = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': "El correo ya está registrado.",
      'auth/invalid-email': "Correo inválido.",
      'auth/weak-password': "La contraseña debe tener al menos 6 caracteres.",
    };
    Swal.fire({
      icon: "error",
      title: "Error de autenticación",
      text: errorMessages[errorCode] || "Error al registrar. Inténtalo de nuevo.",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="container-register">
      <div className="card card-register mx-auto">
        <div className="card-body card-body-register">
          <h2 className="text-center">Registro</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input 
                type="text" 
                className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              <button type="submit" className="btn btn-primary">Registrarse</button>
            </div>
          </form>
          <p className="text-center mt-3">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
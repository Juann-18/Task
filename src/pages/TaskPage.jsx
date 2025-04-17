import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import Swal from "sweetalert2";
import "../styles/register.css";

import imgAddTask from "../assets/addTask.png"; // Asegúrate de tener esta imagen en la ruta correcta

export const TaskPage = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !estado) {
      Swal.fire({
        icon: "warning",
        title: "Todos los campos son obligatorios",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      // Obtener el UID del usuario autenticado
      const user = auth.currentUser;
      const userId = user.uid;

      // Crear la tarea en Firestore
      const nuevaTarea = await addDoc(collection(db, "tareas"), {
        titulo: titulo,
        estado: estado,
        descripcion: descripcion,
        usuarioId: userId, // Relación con el usuario
        fechaCreacion: new Date(),
      });

      Swal.fire({
        icon: "success",
        title: "¡Tarea agregada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/inicio");
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };
  return (
    <div className="container-addTask flex flex-col md:flex-row justify-center items-center h-screen">
      <div className="container-img w-80 mb-4 md:mb-0 md:mr-4">
        <img src={imgAddTask} alt="Addtask" className="rounded-2xl " />
      </div>
      <div className="card card-register mx-auto">
        <div className="card-body card-body-register">
          <h2 className="text-center text-3xl mb-4 font-bold">Nueva tarea</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Titulo</label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripcion</label>
              <input
                type="text"
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">estado</label>
              <input
                type="text"
                className="form-control"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Agregar Tarea
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors mt-2"
                onClick={() => navigate("/inicio")}
              >
                cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

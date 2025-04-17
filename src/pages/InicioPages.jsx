import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import Task from "../components/Task.jsx";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const InicioPages = () => {
  const user = auth.currentUser;
  const name = user.displayName;
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
        console.warn("El usuario no está autenticado");
        return;
      }

      const userId = auth.currentUser.uid;

      try {
        // Obtener tareas filtradas por usuarioId
        const querySnapshot = await getDocs(collection(db, "tareas"));
        const fetchedTasks = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.usuarioId === userId); // Filtrar tareas propias

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-{rgb(33 37 41)}">
      <div className="w-150 m-1 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mt-4">
          <i class="bi bi-journal-bookmark-fill mr-1"></i>
          {name}
        </h1>
        <div className="h-1 bg-blue-600 w-full my-4"></div>

        {/* Sección de tareas */}
        <div className="w-full text-left mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-1">Tus Tareas</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">
              No hay tareas disponibles.
            </p>
          ) : (
            tasks.map((task) => (
              <Task
                taskId={task.id}
                titulo={task.titulo}
                descripcion={task.descripcion}
                estado={task.estado}
                most={false}
                setTasks={setTasks}
              />
            ))
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors mt-4"
            onClick={() => navigate("/task")}
          >
            <i class="bi bi-plus-circle-dotted mr-1"></i>
            Agregar Tareas
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config'
import Task  from '../components/Task.jsx';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';


export const InicioPages = () => {
  const user = auth.currentUser;
  const name = user.displayName
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
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(task => task.usuarioId === userId); // Filtrar tareas propias
  
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
  <div className="w-96 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
    {/* Título */}
    <h1 className="text-4xl font-bold text-center text-blue-600 mt-4">{name}</h1>
    <div className="h-1 bg-blue-600 w-full my-4"></div>

    {/* Sección de tareas */}
    <div className="w-full text-left mb-6">
      <p className="text-lg font-semibold text-gray-700 mb-4">Tareas</p>
    </div>

    <div className="grid grid-cols-3 gap-4 w-full">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 col-span-3">No hay tareas disponibles.</p>
      ) : (
        tasks.map(task => (
          <Task
            key={task.id}
            titulo={task.titulo}
            descripcion={task.descripcion}
            estado={task.estado}
            most={false}
          />
        ))
      )}
    </div>
    <div className='flex space-x-4'>
    <button
        type="button"
        className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors mt-4"
        onClick={() => navigate('/Delete')}
      >Eliminar Tarea</button>
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors mt-4"
        onClick={() => navigate('/task')}
      >
        Agregar Tareas
      </button>
      
    </div>
  </div>
</div>

    
  )
}

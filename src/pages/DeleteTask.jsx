import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Task from '../components/Task'

const db = getFirestore();
export const DeleteTask = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;
if (!user) {
  Swal.fire({
    icon: 'warning',
    title: 'Debes iniciar sesión para ver tus tareas',
    showConfirmButton: true,
  });
  navigate('/login'); // Redirige al inicio de sesión
  return null; // Detén la ejecución si no hay usuario
}

if (!user) {
  Swal.fire({
    icon: 'warning',
    title: 'Debes iniciar sesión para ver tus tareas',
    showConfirmButton: true,
  });
  navigate('/'); // Redirige al inicio de sesión
  return null; // Detén la ejecución si no hay usuario
}



  useEffect(() => {
    const userId = user.uid;
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tareas'));
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Guarda el ID del documento
        ...doc.data(), // Incluye los datos de la tarea
      })).filter(task => task.usuarioId === userId); 
      setTasks(tasksArray); // Actualiza el estado con las tareas
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const tareaRef = doc(db, 'tareas', id);
      await deleteDoc(tareaRef);

      Swal.fire({
        icon: 'success',
        title: '¡Tarea eliminada con éxito!',
        showConfirmButton: false,
        timer: 1500,
      });

      // Actualiza la lista eliminando la tarea localmente
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);

      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema al eliminar la tarea',
        text: error.message,
      });
    }
  };

  return (
    <div className="container-register">
      <div className="card card-register mx-auto">
        <div className="card-body card-body-register">
          <h2 className="text-center">Tareas Existentes</h2>
          <div className="grid grid-cols-3 gap-4 w-full">
          {tasks.length === 0 ? (
          <p className="text-center text-gray-500 col-span-3">
            No hay tareas disponibles.
          </p>
        ) : (
          tasks.map((task) => (
            <Task
            key={task.id}
            taskId={task.id}
            titulo={task.titulo}
            descripcion={task.descripcion}
            estado={task.estado}
            most={true}
            onDelete={handleDelete} 
          />
          ))
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

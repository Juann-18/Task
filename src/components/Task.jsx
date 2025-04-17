import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebase/config"; // Asegúrate de importar auth

const db = getFirestore();

const Task = ({
  taskId,
  titulo,
  descripcion,
  estado,
  most,
  onDelete,
  setTasks,
}) => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Debes iniciar sesión para ver tus tareas",
      showConfirmButton: true,
    });
    navigate("/login");
    return null;
  }

  const handleDelete = async (id) => {
    if (!id) {
      console.error("El ID de la tarea no es válido");
      return;
    }

    try {
      const tareaRef = doc(db, "tareas", id);
      await deleteDoc(tareaRef);

      Swal.fire({
        icon: "success",
        title: "¡Tarea eliminada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Actualiza la lista de tareas si setTasks está disponible
      if (setTasks) {
        setTasks((prevTasks) =>
          Array.isArray(prevTasks)
            ? prevTasks.filter((task) => task.id !== id)
            : []
        );
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);

      Swal.fire({
        icon: "error",
        title: "Hubo un problema al eliminar la tarea",
        text: error.message,
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <header>
        <h2 className="text-xl font-bold">{titulo}</h2>
      </header>
      <main>
        <p className="text-gray-600 break-words">{descripcion}</p>
      </main>
      <footer>
        <p className="text-sm text-gray-500">Estado: {estado}</p>
      </footer>
      <button
        className="px-2 py-1 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors mt-4"
        onClick={() => {
          if (onDelete) {
            onDelete(taskId);
          } else {
            handleDelete(taskId);
          }
        }}
      >
        <i class="bi bi-x-circle-fill"></i>
      </button>
      <button
        className="px-2 py-1 bg-green-900 text-white font-bold rounded-md hover:bg-green-700 transition-colors mt-4 ml-2"
        onClick={() => {}}
      >
        <i class="bi bi-pencil-square"></i>
      </button>
    </div>
  );
};

export default Task;

import { useNavigate } from 'react-router-dom';
const Task = ({taskId, titulo, descripcion, estado, most, onDelete }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-4 border rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-bold">{titulo}</h2>
        <p className="text-gray-600">{descripcion}</p>
        <p className="text-sm text-gray-500">Estado: {estado}</p>

        {most && (
          <button className='px-2 py-1 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors mt-4'
          onClick={() => {onDelete(taskId)
            navigate('/inicio')
          }}>Eliminar</button>
        )}
      </div>
    </>

  
  );
};
export default Task;

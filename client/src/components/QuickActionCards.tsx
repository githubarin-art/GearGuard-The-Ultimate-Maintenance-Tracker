import { useState } from 'react';
import { Plus, CheckSquare, Calendar } from 'lucide-react';
import Button from './Button';

interface QuickActionCardsProps {
  onNewTask?: () => void;
}

const QuickActionCards = ({ onNewTask }: QuickActionCardsProps) => {
  const [myTodos, setMyTodos] = useState([
    { id: 1, text: 'Review maintenance schedules', completed: false },
    { id: 2, text: 'Update equipment inventory', completed: false },
    { id: 3, text: 'Assign technicians to new requests', completed: true },
  ]);

  const toggleTodo = (id: number) => {
    setMyTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* New Task Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">New Task/Item</h3>
          <Plus className="w-6 h-6" />
        </div>
        <p className="text-blue-100 mb-6">
          Quickly create a new maintenance request or task
        </p>
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full bg-white text-blue-600 hover:bg-blue-50"
            onClick={onNewTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Maintenance Request
          </Button>
          <Button
            variant="secondary"
            className="w-full bg-blue-400 text-white hover:bg-blue-300"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Preventive Maintenance
          </Button>
        </div>
      </div>

      {/* My To-Dos Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">My To-Dos</h3>
          <CheckSquare className="w-6 h-6 text-gray-400" />
        </div>
        <div className="space-y-3">
          {myTodos.map(todo => (
            <label
              key={todo.id}
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span
                className={`ml-3 text-sm ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}
              >
                {todo.text}
              </span>
            </label>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New To-Do
        </Button>
      </div>
    </div>
  );
};

export default QuickActionCards;

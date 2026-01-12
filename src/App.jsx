import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "Market Research" },
        { id: "2", content: "Game Research" },
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [{ id: "3", content: "chal raha hai" }],
    },
    done: {
      name: "Done",
      items: [{ id: "4", content: "ho gaya" }],
    },
  });

  const [newTask, setNewTask] = useState("");
  const [activeColumns, setActiveColumns] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updated = { ...columns };
    updated[activeColumns].items.push({
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updated);
    setNewTask("");
  };

  const removeTask = (columnId, taskId) => {
    const updated = { ...columns };
    updated[columnId].items = updated[columnId].items.filter(
      (i) => i.id !== taskId
    );
    setColumns(updated);
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;

    if (sourceColumnId === columnId) return;

    const updated = { ...columns };

    updated[sourceColumnId].items = updated[sourceColumnId].items.filter(
      (i) => i.id !== item.id
    );

    updated[columnId].items.push(item);

    setColumns(updated);
    setDraggedItem(null);
  };

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400",
    },
    inProgress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400",
    },
    done: {
      header: "bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400",
    },
  };

  return (
    <>
      <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 w-full max-w-6xl">

          <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">
            KanBan Board
          </h1>

          {/* Add Task Section */}
          <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add New Task"
              className="flex-grow p-3 bg-zinc-700 text-white"
              onKeyDown={(e) => e.key === "Enter" && addNewTask()}
            />

            <select
              value={activeColumns}
              onChange={(e) => setActiveColumns(e.target.value)}
              className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600"
            >
              {Object.keys(columns).map((columnId) => (
                <option key={columnId} value={columnId}>
                  {columns[columnId].name}
                </option>
              ))}
            </select>

            <button
              onClick={addNewTask}
              className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-400 transition-all duration-200 cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Columns */}
          <div className="flex gap-6 overflow-x-auto pb-6 w-full">
            {Object.keys(columns).map((columnId) => (
              <div
                key={columnId}
                className={`flex-shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl border-t-4 ${columnStyles[columnId].border}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                {/* Column Header */}
                <div
                  className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyles[columnId].header}`}
                >
                  {columns[columnId].name}
                  <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm">
                    {columns[columnId].items.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="p-3 min-h-64">
                  {columns[columnId].items.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 italic text-sm">
                      Drop tasks here
                    </div>
                  ) : (
                    columns[columnId].items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        draggable
                        onDragStart={() => handleDragStart(columnId, item)}
                      >
                        <span>{item.content}</span>

                        <button
                          onClick={() => removeTask(columnId, item.id)}
                          className="text-zinc-400 hover:text-red-400 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600"
                        >
                          <span className="text-lg cursor-pointer">x</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

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
    if (!newTask.trim()) return;

    setColumns((prev) => ({
      ...prev,
      [activeColumns]: {
        ...prev[activeColumns],
        items: [
          ...prev[activeColumns].items,
          { id: Date.now().toString(), content: newTask },
        ],
      },
    }));

    setNewTask("");
  };

  const removeTask = (columnId, taskId) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.filter((i) => i.id !== taskId),
      },
    }));
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceId, item } = draggedItem;
    if (sourceId === columnId) return;

    setColumns((prev) => {
      const sourceItems = prev[sourceId].items.filter(
        (i) => i.id !== item.id
      );
      const targetItems = [...prev[columnId].items, item];

      return {
        ...prev,
        [sourceId]: { ...prev[sourceId], items: sourceItems },
        [columnId]: { ...prev[columnId], items: targetItems },
      };
    });

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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">
          KanBan Board
        </h1>

        {/* Add Task */}
        <div className="w-full max-w-lg flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add New Task"
            className="flex-grow p-3 bg-zinc-700 text-white outline-none"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />

          <select
            value={activeColumns}
            onChange={(e) => setActiveColumns(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-t sm:border-t-0 sm:border-l border-zinc-600"
          >
            {Object.keys(columns).map((id) => (
              <option key={id} value={id}>
                {columns[id].name}
              </option>
            ))}
          </select>

          <button
            onClick={addNewTask}
            className="p-3 sm:px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-400 transition"
          >
            Add
          </button>
        </div>

        {/* Columns */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-4 sm:gap-6 pb-6">
            {Object.keys(columns).map((columnId) => (
              <div
                key={columnId}
                className={`w-72 sm:w-80 flex-shrink-0 bg-zinc-800 rounded-lg shadow-xl border-t-4 ${columnStyles[columnId].border}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                {/* Header */}
                <div
                  className={`p-4 text-white font-bold text-lg sm:text-xl rounded-t-md ${columnStyles[columnId].header}`}
                >
                  {columns[columnId].name}
                  <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-xs sm:text-sm">
                    {columns[columnId].items.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="p-3 min-h-[200px]">
                  {columns[columnId].items.length === 0 ? (
                    <p className="text-center text-zinc-500 italic text-sm py-10">
                      Drop tasks here
                    </p>
                  ) : (
                    columns[columnId].items.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() =>
                          handleDragStart(columnId, item)
                        }
                        className="p-3 mb-3 bg-zinc-700 text-white rounded-lg shadow-md flex justify-between items-center cursor-move transition hover:scale-[1.02]"
                      >
                        <span className="text-sm sm:text-base">
                          {item.content}
                        </span>

                        <button
                          onClick={() =>
                            removeTask(columnId, item.id)
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-400 hover:bg-zinc-600"
                        >
                          ×
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
    </div>
  );
};

export default App;

"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { loadFromStorage, saveToStorage } from "../lib/storage";

const priorities = {
  low: { label: "Düşük", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  medium: { label: "Orta", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  high: { label: "Yüksek", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const columns = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "inprogress", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass p-4 mb-3 group hover:neon-glow transition-all duration-300 ${task.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="cursor-grab mt-1 text-gray-500 hover:text-neon">
          <GripVertical size={16} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="accent-neon w-4 h-4"
            />
            <span className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
              {task.title}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-400 ml-6 mb-2">{task.description}</p>
          )}
          <div className="flex items-center justify-between ml-6">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorities[task.priority].color}`}>
              {priorities[task.priority].label}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="p-1 hover:text-neon">
                <Edit2 size={14} />
              </button>
              <button onClick={() => onDelete(task.id)} className="p-1 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", column: "todo" });
  const [editing, setEditing] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setTasks(loadFromStorage("focusflow-tasks", []));
  }, []);

  useEffect(() => {
    saveToStorage("focusflow-tasks", tasks);
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", priority: "medium", column: "todo" });
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setEditing(null);
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, column: !t.completed ? "done" : t.column } : t
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    let newColumn = activeTask.column;
    if (columns.find((c) => c.id === over.id)) {
      newColumn = over.id;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) newColumn = overTask.column;
    }

    setTasks(tasks.map((t) => (t.id === active.id ? { ...t, column: newColumn } : t)));
    setActiveId(null);
  };

  const getTasksByColumn = (colId) => tasks.filter((t) => t.column === colId);

  return (
    <div className="space-y-6">
      <div className="glass p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} className="text-neon" /> Yeni Görev
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Görev başlığı..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-neon/50"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
          <input
            type="text"
            placeholder="Açıklama (opsiyonel)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-neon/50"
          />
          <button
            onClick={addTask}
            className="md:col-span-2 bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 rounded-xl py-2 font-medium transition-all hover:neon-glow"
          >
            Görev Ekle
          </button>
        </div>
      </div>

      <DndContext collisionDetection={closestCorners} onDragStart={({ active }) => setActiveId(active.id)} onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <div key={col.id} className="glass p-4 min-h-[400px]">
              <h3 className="font-semibold mb-4 text-neon">{col.title}</h3>
              <SortableContext items={getTasksByColumn(col.id).map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {getTasksByColumn(col.id).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditing}
                    onDelete={deleteTask}
                    onToggle={toggleComplete}
                  />
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="glass p-4 opacity-80">
              {tasks.find((t) => t.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Görevi Düzenle</h3>
            <input
              type="text"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-3"
            />
            <textarea
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-3"
              rows={3}
            />
            <select
              value={editing.priority}
              onChange={(e) => setEditing({ ...editing, priority: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-4"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => updateTask(editing.id, editing)}
                className="flex-1 bg-neon/20 text-neon rounded-xl py-2"
              >
                Kaydet
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 bg-white/5 rounded-xl py-2">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import type { Column, Task } from "@/types/types";
import {
  useSensors,
  useSensor,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import { usePlatform } from "@/context/PlatformContext";
import { taskService } from "@/services/taskService";

const columns: Column[] = [
  { id: "todo", columnName: "Todo", status: "TODO" },
  { id: "inProgress", columnName: "In Progress", status: "IN_PROGRESS" },
  { id: "inReview", columnName: "In Review", status: "IN_REVIEW" },
  { id: "done", columnName: "Done", status: "DONE" },
];

const Kanban = ({ tasks }: { tasks: Task[] }) => {
  const {
    state: { error },
    dispatch,
  } = usePlatform();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn) {
      // this update the task status at client side
      dispatch({
        type: "SET_TASKS",
        payload: tasks.map((task) =>
          task.id === active.id ? { ...task, status: overColumn.status } : task
        ),
      });
      // after this we hit update status api
      const updatedTask = await taskService.updateTaskStatus(
        activeTask.id,
        overColumn.status
      );
      // and again we update the status at client side
      dispatch({
        type: "UPDATE_TASK",
        payload: updatedTask.data,
      });
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find((task) => task.id === over.id);
    if (overTask) {
      // Update status to match the target task's status
      if (activeTask.status !== overTask.status) {
        dispatch({
          type: "SET_TASKS",
          payload: tasks.map((task) =>
            task.id === active.id ? { ...task, status: overTask.status } : task
          ),
        });
      }

      // Reorder within the same status
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      console.log("drop over a task");
      dispatch({
        type: "SET_TASKS",
        payload: arrayMove(tasks, oldIndex, newIndex),
      });
    }
  };

  if (error) {
    <h2 className="p-10 text-red-500">{error}!</h2>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[670px]">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} tasks={tasks} />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Kanban;

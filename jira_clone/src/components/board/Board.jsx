import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import api from "../../api/axiosInstance";
import Column from "./Column";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailPanel from "./TaskDetailPanel";
import "./board.css";

const columns = [
    {id: "TO_DO", title: "To Do"},
    {id: "IN_PROGRESS", title: "In Progress"},
    {id: "DONE", title: "Done"},
];

const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
};

const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
        const priorityDifference = (priorityOrder[a.priority?.toLowerCase()] || 2) - (priorityOrder[b.priority?.toLowerCase()] || 2);

        if(priorityDifference !== 0) return priorityDifference;

        return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
    });
};

export default function Board({projectId, tasks, members, onTasksChange}){
    const [activeTask, setActiveTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {distance: 6},
    }));

    const groupedTasks = useMemo(() => {
        return columns.reduce((groups, column) => {
            groups[column.id] = sortTasks(tasks.filter((task) => task.status === column.id));
            return groups;
        }, {});
    }, [tasks]);

    const updateTasks = (nextTasks) => {
        onTasksChange(nextTasks);
    };

    const handleDragStart = (event) => {
        setActiveTask(event.active.data.current?.task || null);
    };

    const handleDragEnd = async (event) => {
        const task = event.active.data.current?.task;
        const nextStatus = event.over?.id;
        setActiveTask(null);

        if(!task || !nextStatus || task.status === nextStatus) return;

        const previousTasks = tasks;
        const nextTasks = tasks.map((item) => {
            if(item.id !== task.id) return item;

            return {...item, status: nextStatus};
        });

        updateTasks(nextTasks);

        try{
            await api.patch(`/updatestatus/${task.id}`, {
                status: nextStatus,
            }, {
                withCredentials: true,
            });
        }catch(err){
            console.log(err);
            updateTasks(previousTasks);
        }
    };

    const handleTaskCreated = (task) => {
        updateTasks([...tasks, task]);
    };

    const handleTaskUpdated = (updatedTask) => {
        updateTasks(tasks.map((task) => {
            if(task.id !== updatedTask.id) return task;

            return updatedTask;
        }));
    };

    const handleTaskDeleted = (taskId) => {
        updateTasks(tasks.filter((task) => task.id !== taskId));
    };

    return(
        <section className="kanban-board-shell">
            <div className="kanban-board-header">
                <div>
                    <span>Project Board</span>
                    <h1>Tasks</h1>
                </div>
                <button type="button" onClick={() => setCreateTaskOpen(true)}>+ Create Task</button>
            </div>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                    {columns.map((column) => (
                        <Column
                        key={column.id}
                        column={column}
                        tasks={groupedTasks[column.id]}
                        members={members}
                        onTaskClick={setSelectedTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} members={members} isOverlay /> : null}
                </DragOverlay>
            </DndContext>

            {createTaskOpen && (
                <CreateTaskModal
                projectId={projectId}
                members={members}
                onClose={() => setCreateTaskOpen(false)}
                onTaskCreated={handleTaskCreated}
                />
            )}

            {selectedTask && (
                <TaskDetailPanel
                members={members}
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                />
            )}
        </section>
    );
}

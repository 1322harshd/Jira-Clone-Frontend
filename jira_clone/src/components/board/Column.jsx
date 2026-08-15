import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({column, tasks, members, onTaskClick}){
    const {setNodeRef, isOver} = useDroppable({
        id: column.id,
    });

    return(
        <section ref={setNodeRef} className={`kanban-column ${isOver ? "kanban-column-over" : ""}`}>
            <div className="kanban-column-header">
                <h2>{column.title}</h2>
                <span>{tasks.length}</span>
            </div>

            <div className="kanban-column-cards">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} members={members} onClick={() => onTaskClick(task)} />
                ))}
            </div>
        </section>
    );
}

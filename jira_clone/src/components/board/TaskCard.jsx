import { useDraggable } from "@dnd-kit/core";

const priorityClass = {
    high: "task-card-priority-high",
    medium: "task-card-priority-medium",
    low: "task-card-priority-low",
};

export default function TaskCard({task, members = [], onClick, isOverlay = false}){
    const taskId = String(task.id);
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: taskId,
        data: {task},
        disabled: isOverlay,
    });

    const assignee = task.assignee || task.user || task.assignedTo || members.find((member) => String(member.id) === String(task.assignedToId));
    const priority = task.priority?.toLowerCase() || "medium";
    const cardStyle = transform && !isOverlay ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return(
        <article
        ref={setNodeRef}
        className={`task-card ${isDragging ? "task-card-dragging" : ""} ${isOverlay ? "task-card-overlay" : ""}`}
        style={cardStyle}
        onClick={onClick}
        {...listeners}
        {...attributes}
        >
            <div className="task-card-title-row">
                <h3>{task.title}</h3>
                <span className={`task-card-priority ${priorityClass[priority] || priorityClass.medium}`}>
                    {task.priority || "Medium"}
                </span>
            </div>

            {task.description && <p>{task.description}</p>}

            <div className="task-card-meta">
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                {assignee?.image ? (
                    <img src={`http://localhost:3002/${assignee.image}`} alt={`${assignee.name} avatar`} />
                ) : (
                    <span className="task-card-avatar-fallback">{assignee?.name?.charAt(0) || "?"}</span>
                )}
            </div>
        </article>
    );
}

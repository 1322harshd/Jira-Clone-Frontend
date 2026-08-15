import { useMemo, useState } from "react";
import api from "../../api/axiosInstance";

const initialForm = {
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
    status: "TO_DO",
};

const formatDateInput = (dateValue) => {
    if(!dateValue) return "";

    return new Date(dateValue).toISOString().slice(0, 10);
};

const getTaskFromResponse = (responseData) => {
    return responseData?.task || responseData?.updatedTask || responseData?.createdTask || responseData;
};

export default function CreateTaskModal({projectId, members, task, onClose, onTaskCreated, onTaskUpdated}){
    const isEditing = Boolean(task);
    const startingForm = useMemo(() => {
        if(!task) return initialForm;

        const assignee = task.assignee || task.user || task.assignedTo;

        return {
            title: task.title || "",
            description: task.description || "",
            priority: task.priority?.toUpperCase() || "MEDIUM",
            dueDate: formatDateInput(task.dueDate),
            assigneeId: assignee?.id ? String(assignee.id) : task.assignedToId ? String(task.assignedToId) : "",
            status: task.status || "TO_DO",
        };
    }, [task]);

    const [formData, setFormData] = useState(startingForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            setIsSubmitting(true);
            setError("");

            const taskData = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                assignedToId: formData.assigneeId || null,
                status: formData.status,
            };

            const response = isEditing ? await api.put(`/updatetask/${task.id}`, taskData, {
                withCredentials: true,
            }) : await api.post(`/createtask/${projectId}`, taskData, {
                withCredentials: true,
            });

            const responseTask = getTaskFromResponse(response.data);
            const selectedAssignee = members.find((member) => String(member.id) === String(formData.assigneeId));
            const savedTask = isEditing ? {
                ...task,
                ...taskData,
                ...(responseTask?.id ? responseTask : {}),
                id: task.id,
                assignee: selectedAssignee || null,
                assignedTo: selectedAssignee || null,
            } : {
                ...taskData,
                ...responseTask,
                assignee: selectedAssignee || null,
                assignedTo: selectedAssignee || null,
            };

            if(isEditing){
                onTaskUpdated(savedTask);
            }else{
                onTaskCreated(savedTask);
            }

            onClose();
        }catch(err){
            setError(err.response?.data?.message || `Could not ${isEditing ? "update" : "create"} task`);
        }finally{
            setIsSubmitting(false);
        }
    };

    return(
        <div className="task-modal-backdrop" role="presentation" onMouseDown={onClose}>
            <form className="task-create-modal" onSubmit={handleSubmit} onMouseDown={(e) => e.stopPropagation()}>
                <div className="task-modal-header">
                    <h2>{isEditing ? "Edit Task" : "Create Task"}</h2>
                    <button type="button" onClick={onClose} aria-label="Close task modal">x</button>
                </div>

                <div className="task-modal-fields">
                    <label>
                        <span>Title</span>
                        <input name="title" type="text" value={formData.title} onChange={handleChange} required />
                    </label>

                    <label>
                        <span>Description</span>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                    </label>

                    <label>
                        <span>Priority</span>
                        <select name="priority" value={formData.priority} onChange={handleChange}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </label>

                    <label>
                        <span>Due Date</span>
                        <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
                    </label>

                    <label>
                        <span>Assignee</span>
                        <select name="assigneeId" value={formData.assigneeId} onChange={handleChange}>
                            <option value="">Unassigned</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Status</span>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="TO_DO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </label>
                </div>

                {error && <p className="task-modal-error">{error}</p>}

                <button className="task-modal-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (isEditing ? "Saving" : "Creating") : (isEditing ? "Save Changes" : "Create")}
                </button>
            </form>
        </div>
    );
}

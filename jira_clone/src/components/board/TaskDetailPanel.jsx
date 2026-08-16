import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosInstance";

const formatDateInput = (dateValue) => {
    if(!dateValue) return "";

    return new Date(dateValue).toISOString().slice(0, 10);
};

const getTaskFromResponse = (responseData) => {
    return responseData?.task || responseData?.updatedTask || responseData;
};

export default function TaskDetailPanel({task, members, currentUser, onClose, onTaskUpdated, onTaskDeleted}){
    const startingForm = useMemo(() => {
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
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [error, setError] = useState("");
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchComments = async () => {
            try{
                setIsLoadingComments(true);
                setCommentError("");

                const response = await api.get(`/getcomments/${task.id}`, {
                    withCredentials: true,
                    signal: abortController.signal,
                });

                setComments(response.data || []);
            }catch(err){
                if(err.code === "ERR_CANCELED") return;
                setCommentError(err.response?.data?.message || "Could not load comments");
            }finally{
                setIsLoadingComments(false);
            }
        };

        fetchComments();

        return () => {
            abortController.abort();
        };
    }, [task.id]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try{
            setIsSaving(true);
            setError("");

            const taskData = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                assignedToId: formData.assigneeId || null,
                status: formData.status,
            };

            const response = await api.put(`/updatetask/${task.id}`, taskData, {
                withCredentials: true,
            });

            const responseTask = getTaskFromResponse(response.data);
            const selectedAssignee = members.find((member) => String(member.id) === String(formData.assigneeId));

            onTaskUpdated({
                ...task,
                ...taskData,
                ...(responseTask?.id ? responseTask : {}),
                id: task.id,
                assignee: selectedAssignee || null,
                assignedTo: selectedAssignee || null,
            });
            onClose();
        }catch(err){
            setError(err.response?.data?.message || "Could not update task");
        }finally{
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try{
            setIsDeleting(true);
            setError("");

            await api.delete(`/deletetask/${task.id}`, {
                withCredentials: true,
            });

            onTaskDeleted(task.id);
            setDeleteConfirmOpen(false);
            onClose();
        }catch(err){
            setError(err.response?.data?.message || "Could not delete task");
        }finally{
            setIsDeleting(false);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();

        const trimmedComment = commentText.trim();

        if(!trimmedComment) return;

        try{
            setIsPostingComment(true);
            setCommentError("");

            const response = await api.post(`/comment/${task.id}`, {
                content: trimmedComment,
            }, {
                withCredentials: true,
            });

            const newComment = response.data.comment || {
                id: response.data.id || `${task.id}-${Date.now()}`,
                content: trimmedComment,
                userId: currentUser?.id,
                createdAt: new Date().toISOString(),
            };

            setComments((prevComments) => [...prevComments, newComment]);
            setCommentText("");
        }catch(err){
            setCommentError(err.response?.data?.message || "Could not add comment");
        }finally{
            setIsPostingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try{
            setDeletingCommentId(commentId);
            setCommentError("");

            await api.delete(`/deletecomment/${commentId}`, {
                withCredentials: true,
            });

            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        }catch(err){
            setCommentError(err.response?.data?.message || "Could not delete comment");
        }finally{
            setDeletingCommentId(null);
        }
    };

    return(
        <>
        <motion.aside
        className="task-detail-drawer"
        initial={{x: "105%"}}
        animate={{x: 0}}
        exit={{x: "105%"}}
        transition={{duration: 0.3, ease:"easeOut"}}
        >
            <div className="task-detail-drawer-header">
                <div>
                    <span>Task Detail</span>
                    <h2>Edit Task</h2>
                </div>
                <button type="button" onClick={onClose} aria-label="Close task detail panel">x</button>
            </div>

            <form className="task-detail-form" onSubmit={handleSave}>
                <label>
                    <span>Title</span>
                    <input name="title" type="text" value={formData.title} onChange={handleChange} required />
                </label>

                <label>
                    <span>Description</span>
                    <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                </label>

                <label>
                    <span>Status</span>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="TO_DO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
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

                {error && <p className="task-detail-error">{error}</p>}

                <div className="task-detail-actions">
                    <button className="task-detail-delete" type="button" onClick={() => setDeleteConfirmOpen(true)} disabled={isDeleting || isSaving}>
                        {isDeleting ? "Deleting" : "Delete"}
                    </button>
                    <button className="task-detail-save" type="submit" disabled={isSaving || isDeleting}>
                        {isSaving ? "Saving" : "Save"}
                    </button>
                </div>
            </form>

            <section className="task-comments">
                <div className="task-comments-header">
                    <h3>Comments</h3>
                    <span>{comments.length}</span>
                </div>

                <form className="task-comment-form" onSubmit={handlePostComment}>
                    <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment"
                    ></textarea>
                    <button type="submit" disabled={isPostingComment || !commentText.trim()}>
                        {isPostingComment ? "Posting" : "Post"}
                    </button>
                </form>

                {commentError && <p className="task-comment-error">{commentError}</p>}

                <div className="task-comment-list">
                    {isLoadingComments && <p className="task-comment-empty">Loading comments...</p>}

                    {!isLoadingComments && comments.length === 0 && (
                        <p className="task-comment-empty">No comments yet.</p>
                    )}

                    {!isLoadingComments && comments.map((comment) => (
                        <article className="task-comment" key={comment.id}>
                            <p>{comment.content}</p>
                            <div>
                                <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Just now"}</span>
                                {String(comment.userId) === String(currentUser?.id) && (
                                    <button type="button" onClick={() => handleDeleteComment(comment.id)} disabled={deletingCommentId === comment.id}>
                                        {deletingCommentId === comment.id ? "Deleting" : "Delete"}
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </motion.aside>

        {deleteConfirmOpen && (
            <div className="task-delete-modal-backdrop" role="presentation" onMouseDown={() => setDeleteConfirmOpen(false)}>
                <div className="task-delete-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
                    <h3>Delete task?</h3>
                    <p>This will permanently remove "{task.title}" from the board.</p>

                    <div className="task-delete-modal-actions">
                        <button type="button" className="task-delete-cancel" onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
                            Cancel
                        </button>
                        <button type="button" className="task-delete-confirm" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting" : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

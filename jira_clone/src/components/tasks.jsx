import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../styles/components/dashboardTab.css";

const columns = [
    {id: "TO_DO", label: "To Do"},
    {id: "IN_PROGRESS", label: "In Progress"},
    {id: "DONE", label: "Done"},
];

const emptyTasks = {
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
};

export default function Tasks(){
    const [tasks, setTasks] = useState(emptyTasks);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const abortController = new AbortController();

        const fetchTasks = async () => {
            try{
                setLoading(true);
                setError("");

                const response = await api.get("/dashboard/tasks", {
                    withCredentials: true,
                    signal: abortController.signal,
                });

                setTasks(response.data.tasks || emptyTasks);
            }catch(err){
                if(err.code === "ERR_CANCELED") return;
                setError(err.response?.data?.message || "Could not load tasks");
            }finally{
                setLoading(false);
            }
        };

        fetchTasks();

        return () => {
            abortController.abort();
        };
    }, []);

    if(loading){
        return <main className="dashboard-home"><p className="dashboard-state">Loading tasks...</p></main>;
    }

    if(error){
        return <main className="dashboard-home"><p className="dashboard-state dashboard-state-error">{error}</p></main>;
    }

    return(
        <main className="dashboard-home">
            <div className="dashboard-home-header">
                <div>
                    <span>Assigned Work</span>
                    <h1>My Tasks</h1>
                </div>
            </div>

            <section className="dashboard-content-grid dashboard-task-page-grid">
                {columns.map((column) => (
                    <div className="dashboard-panel" key={column.id}>
                        <div className="dashboard-panel-header">
                            <h2>{column.label}</h2>
                            <span>{tasks[column.id]?.length || 0}</span>
                        </div>

                        <div className="dashboard-list">
                            {(tasks[column.id] || []).length === 0 && <p className="dashboard-empty">No tasks here.</p>}
                            {(tasks[column.id] || []).map((task) => (
                                <article className="dashboard-task-row" key={task.id}>
                                    <div>
                                        <h3>{task.title}</h3>
                                        <span>{task.priority}</span>
                                    </div>
                                    <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}

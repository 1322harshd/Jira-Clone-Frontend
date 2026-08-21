import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const getProjectId = (projectMember) => {
    return projectMember.projectId || projectMember.project?.id || projectMember.id;
};

const getProjectName = (projectMember) => {
    return projectMember.project?.name || `Project ${getProjectId(projectMember)}`;
};

export default function DashboardTab(){
    const [dashboardData, setDashboardData] = useState({
        user: null,
        projects: [],
        tasks: emptyTasks,
    });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const abortController = new AbortController();

        const fetchDashboard = async () => {
            try{
                setLoading(true);
                setError("");

                const [dashboardResponse, activityResponse] = await Promise.all([
                    api.get("/dashboard", {
                        withCredentials: true,
                        signal: abortController.signal,
                    }),
                    api.get("/recentactivity", {
                        withCredentials: true,
                        signal: abortController.signal,
                    }),
                ]);

                setDashboardData({
                    user: dashboardResponse.data.user || null,
                    projects: dashboardResponse.data.projects || [],
                    tasks: dashboardResponse.data.tasks || emptyTasks,
                });
                setActivity(activityResponse.data.activity || []);
            }catch(err){
                if(err.code === "ERR_CANCELED") return;
                setError(err.response?.data?.message || "Could not load dashboard");
            }finally{
                setLoading(false);
            }
        };

        fetchDashboard();

        return () => {
            abortController.abort();
        };
    }, []);

    const taskTotals = useMemo(() => {
        const tasks = dashboardData.tasks || emptyTasks;
        const byStatus = columns.reduce((totals, column) => {
            totals[column.id] = tasks[column.id]?.length || 0;
            return totals;
        }, {});

        return {
            byStatus,
            total: Object.values(byStatus).reduce((sum, count) => sum + count, 0),
        };
    }, [dashboardData.tasks]);

    const nextTasks = useMemo(() => {
        return columns
            .flatMap((column) => dashboardData.tasks?.[column.id] || [])
            .sort((a, b) => new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31"))
            .slice(0, 5);
    }, [dashboardData.tasks]);

    if(loading){
        return <main className="dashboard-home"><p className="dashboard-state">Loading dashboard...</p></main>;
    }

    if(error){
        return <main className="dashboard-home"><p className="dashboard-state dashboard-state-error">{error}</p></main>;
    }

    const userImage = dashboardData.user?.image ? `http://localhost:3002/${dashboardData.user.image}` : null;

    return(
        <main className="dashboard-home">
            <div className="dashboard-home-header">
                <div className="dashboard-home-header-user">
                    {userImage ? (
                        <img src={userImage} alt="" className="dashboard-user-avatar" />
                    ) : (
                        <span className="dashboard-user-avatar dashboard-user-avatar-fallback">
                            {(dashboardData.user?.name || "?").charAt(0)}
                        </span>
                    )}
                    <div>
                        <span>Welcome back{dashboardData.user?.name ? `, ${dashboardData.user.name}` : ""}</span>
                        <h1>Dashboard</h1>
                    </div>
                </div>
                <Link to="/dashboard/projects">View Projects</Link>
            </div>

            <section className="dashboard-stat-grid">
                <article>
                    <span>Projects</span>
                    <strong>{dashboardData.projects.length}</strong>
                </article>
                <article>
                    <span>Assigned Tasks</span>
                    <strong>{taskTotals.total}</strong>
                </article>
                <article>
                    <span>In Progress</span>
                    <strong>{taskTotals.byStatus.IN_PROGRESS}</strong>
                </article>
                <article>
                    <span>Done</span>
                    <strong>{taskTotals.byStatus.DONE}</strong>
                </article>
            </section>

            <section className="dashboard-task-summary">
                {columns.map((column) => (
                    <article key={column.id}>
                        <div>
                            <h2>{column.label}</h2>
                            <span>{taskTotals.byStatus[column.id]}</span>
                        </div>
                        <div className="dashboard-progress-track">
                            <span style={{width: `${taskTotals.total ? (taskTotals.byStatus[column.id] / taskTotals.total) * 100 : 0}%`}}></span>
                        </div>
                    </article>
                ))}
            </section>

            <div className="dashboard-content-grid">
                <section className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <h2>Upcoming Tasks</h2>
                        <Link to="/dashboard/tasks">All Tasks</Link>
                    </div>

                    <div className="dashboard-list">
                        {nextTasks.length === 0 && <p className="dashboard-empty">No assigned tasks yet.</p>}
                        {nextTasks.map((task) => (
                            <article className="dashboard-task-row" key={task.id}>
                                <div>
                                    <h3>{task.title}</h3>
                                    <span>{task.status?.replace("_", " ")}</span>
                                </div>
                                <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <h2>Recent Activity</h2>
                    </div>

                    <div className="dashboard-list">
                        {activity.length === 0 && <p className="dashboard-empty">No recent activity yet.</p>}
                        {activity.slice(0, 8).map((item) => (
                            <article className="dashboard-activity-row" key={item.id}>
                                <strong>{item.type}</strong>
                                <p>{item.message}</p>
                                <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            <section className="dashboard-panel dashboard-project-panel">
                <div className="dashboard-panel-header">
                    <h2>Your Projects</h2>
                    <Link to="/dashboard/projects">Open Projects</Link>
                </div>

                <div className="dashboard-project-list">
                    {dashboardData.projects.length === 0 && <p className="dashboard-empty">You are not in any projects yet.</p>}
                    {dashboardData.projects.slice(0, 6).map((projectMember) => (
                        <Link to={`/project/${getProjectId(projectMember)}`} key={projectMember.id || getProjectId(projectMember)}>
                            <span>{getProjectName(projectMember)}</span>
                            <small>{getProjectId(projectMember)}</small>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}

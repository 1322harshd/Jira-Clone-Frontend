import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../api/axiosInstance";

const emptyResults = {projects: [], tasks: []};

export default function SearchBar(){
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState(emptyResults);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(wrapperRef.current && !wrapperRef.current.contains(e.target)){
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        clearTimeout(debounceRef.current);

        const trimmed = query.trim();
        if(!trimmed) return;

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try{
                const response = await api.get("/search", {params: {q: trimmed}});
                setResults({
                    projects: response.data.projects || [],
                    tasks: response.data.tasks || [],
                });
            }catch{
                setResults(emptyResults);
            }finally{
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const closeSearch = () => {
        setOpen(false);
        setQuery("");
        setResults(emptyResults);
    };

    const handleQueryChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if(!value.trim()){
            setResults(emptyResults);
            setLoading(false);
        }else{
            setLoading(true);
        }
    };

    const goToProject = (projectId) => {
        closeSearch();
        navigate(`/project/${projectId}`);
    };

    const hasQuery = query.trim().length > 0;
    const hasResults = results.projects.length > 0 || results.tasks.length > 0;

    return (
        <div className="search-input" ref={wrapperRef}>
            <FiSearch className="search-logo" />
            <input
                type="text"
                placeholder="Search"
                name="search"
                value={query}
                onChange={handleQueryChange}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => { if(e.key === "Escape") closeSearch(); }}
            />

            {open && hasQuery && (
                <div className="search-results">
                    {loading && <p className="search-state">Searching...</p>}

                    {!loading && !hasResults && (
                        <p className="search-state">No results for "{query.trim()}"</p>
                    )}

                    {!loading && results.projects.length > 0 && (
                        <div className="search-results-group">
                            <span className="search-results-label">Projects</span>
                            {results.projects.map((project) => (
                                <button
                                    type="button"
                                    key={project.id}
                                    className="search-result-row"
                                    onClick={() => goToProject(project.id)}
                                >
                                    {project.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {!loading && results.tasks.length > 0 && (
                        <div className="search-results-group">
                            <span className="search-results-label">Tasks</span>
                            {results.tasks.map((task) => (
                                <button
                                    type="button"
                                    key={task.id}
                                    className="search-result-row"
                                    onClick={() => goToProject(task.projectId)}
                                >
                                    <span>{task.title}</span>
                                    <small>{task.status?.replace("_", " ")}</small>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

import { createContext,useContext ,useEffect,useState} from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try{
                const response = await api.get("/dashboard",{
                    withCredentials:true,
                    skipAuthRefresh:true,
                });

                setCurrentUser(response.data.user);
            }catch(err){
                setCurrentUser(null);
            }
            finally{
                setAuthLoading(false);
            }
        };

        fetchCurrentUser();
    },[]);

    return(
        <AuthContext.Provider value={{currentUser,setCurrentUser, authLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

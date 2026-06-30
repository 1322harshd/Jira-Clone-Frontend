import axios from 'axios';
import {useState,useEffect} from 'react';
import Header from '../components/header';

export default function Dashboard(){

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try{
            setLoading(true);

            const response = await axios.get('/api/dashboard', {
                withCredentials:true
            });

            setData(response.data);
            console.log('Dashboard response:',response)
        }catch(err){
            setError(err.message || 'Something went wrong');
        }finally {
            setLoading(false);
        }
    };

    fetchData();
},[]);

return(
    <>
    <Header />
    </>
)
}
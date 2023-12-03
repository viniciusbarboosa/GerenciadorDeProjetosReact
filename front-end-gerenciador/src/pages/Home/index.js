import React,{ useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

//TELAS FORAM TODAS PRO MENU 
import Menu from '../../components/Home/Menu/Menu'



const Home = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    const userData = location.state?.user;

      useEffect(() => {
        if (!userData) {
          navigate('/login');
        }
      }, [navigate, userData]);
    
      if (!userData) {
        return null;
      }

    return(
        <div>
        <Menu userData={userData}/>
        </div>
    )
}

export default Home
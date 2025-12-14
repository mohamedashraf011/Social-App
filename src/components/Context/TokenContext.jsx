import { createContext, useEffect } from "react";
import { useState } from "react";
import { getLoggedUser } from "../../API/Auth/LoggedUser";
export const TokenContext = createContext();

export default function TokenContextProvider(props){

    const [token,setToken] = useState(null);
    const [userData,setUserDta] = useState();

    async function getUserData(){
        const x = await getLoggedUser();
        
        setUserDta(x.user);
    }

    useEffect(()=>{
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
            getUserData();

        }
    },[])
    return <TokenContext.Provider value={{token,setToken,userData}}>
        {props.children}
    </TokenContext.Provider>
}
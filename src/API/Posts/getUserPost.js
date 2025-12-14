import axios from "axios";
const token = localStorage.getItem("token");
export async function getUserPost(userId){
    const {data} = await axios.get(`https://linked-posts.routemisr.com/users/${userId}/posts`,{
        headers:{
            token:token
        }
    })
    return data
}
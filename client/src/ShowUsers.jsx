import React from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import './ShowUsers.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const ShowUsers = () => {
      const navigate = useNavigate();
      const goToEdit = (id)=>{
           navigate("/edit" , {state: { id } })
       }
     
      const[users , setUsers] = useState([]);
      const[msg , setMsg] = useState("");
      const[msgColor , setMsgColor] = useState("black");


     useEffect(()=> {
          const fetchUsers = async ()=> {
          try {
            const res = await axios.get("http://localhost:3000/show");
            setUsers(res.data);
          }
          catch (err) {
             console.log("Error in fetching Users" , err); 
          }
        };
         fetchUsers();
      }, []);

        
        const deleteUser = async (id)=>{
             if(!window.confirm("Are you sure you want to delete the User!")) return;
            try {
             const res = await axios.post("http://localhost:3000/delete" , {id});

              if(res.data.status){
                  setUsers(users.filter(u=> u._id !== id));
                  setMsg(res.data.msg);
                  setMsgColor("red");
              } else {
                setMsg(res.data.msg);
                setMsgColor("green");
              }
            }
            catch (err) {
                 console.log(err);
                 setMsg("Server Error ");
                 setMsgColor("red")
            }
        };

      


  return (
      <>
    <Navbar/>
     <div className="users-container">
        <h2>All Registered Users</h2>
      
       {/* Message */}
       {msg && <p style={{
        color:msgColor,
        display:'flex',
        justifyContent:'center',
        padding:'9px',
       }}>{msg}</p>}

     </div>
     <div className="user-grid">
       {users.map((user)=>(
         <div className="user-card" key={user._id}>
              <img 
                 src={`http://localhost:3000/uploads/${user.image}`} 
                 alt="User Pic" 
                   />
               <h5>{user.name}</h5>
               <p>{user.email}</p>
              
              <button
                onClick={()=>deleteUser(user._id)}
                 className='delete-btn'
              >
                Delete
              </button>

              <button
                 onClick={()=>goToEdit(user._id)}
                 className='edit-btn'
              >
                Edit
              </button>
         </div>
          ))}
     </div>
      
  


</>
  );
}


export default ShowUsers;
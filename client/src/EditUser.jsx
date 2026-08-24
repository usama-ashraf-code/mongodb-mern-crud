import React from 'react'
import Navbar from './Navbar'
import { useLocation, useNavigate } from "react-router-dom";
import { useState , useEffect } from 'react'
import axios from 'axios';

const EditUser = () => {
    const location = useLocation();
    const userID = location.state.id;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newImage, setNewImage] = useState(null);

    useEffect(()=>{
        const fetchUsers = async ()=>{
             const res = await axios.post("http://localhost:3000/edit" , {id: userID })
             setUser(res.data.user);
             setName(res.data.user.name);
             setEmail(res.data.user.email);
             setPassword(res.data.user.password)
        }

        fetchUsers();
    }, [userID])

    const handleUpdate = async (e)=>{
          e.preventDefault();

          const formData = new FormData();

          formData.append("id", userID);
          formData.append("name", name);
          formData.append("email", email);
          formData.append("password", password);
          if(newImage) formData.append("newImage" , newImage);

          const res = await axios.post("http://localhost:3000/update" , formData);
          alert(res.data.msg)
          navigate("/show")
    }
    
    if(!user) return <p>Loading...</p>

  return (
      <>
         <Navbar/>
       {/* <!-- Main container for the login form --> */}
        <div className="container">
         <div className="box">
           <form onSubmit={handleUpdate} autoComplete='off'>
           {/* <!-- Title section --> */}
            <div className="title">
             <h1>Register Form</h1>
            </div>
           {/* <!-- Input )fields container --> */}
        <div className="input-box">
          {/* <!-- Username input --> */}
          <label htmlFor="text" className="label-color">User name</label>
          <input
            id="text"
            name="text"
            type="text"
            placeholder="Enter Name"
            required
            value={name}
            onChange={(e)=>{setName(e.target.value)}}
          />
          <label htmlFor="Email" className="label-color">User email</label>
           <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
          <br />
          {/* <!-- Password input --> */}
          <label htmlFor="password" className="label-color">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <br />
         <input
                id='file'      
                type="file"
                name="image"
                required
                // value={image || ""}
                onChange={(e)=>setNewImage(e.target.files[0])}
         />
        <button type="submit" className='submit-btn'>
        
          Update
        </button>
         </div>
      </form>
    </div> 
 </div>
      </>
  )
}

export default EditUser
import {  useState } from 'react'
import './App.css'
import Navbar from './Navbar'
import axios from 'axios'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email:z.string().email("Invalid email!"),
  password: z.string().min(6 , "Password must be 6 character long!"),
  image : z.instanceof(File , "Please select an image!")
})


function App() {
   const[name , setName] =useState("");
   const[email, setEmail]=useState("");
   const[image,setImage]=useState(null);
   const[password,setPassword]=useState("");
   const[errors , setErrors]= useState({});
    
   const handleSubmit = async (e)=> {
        e.preventDefault();

    const FormdataObject = { name , email , password , image};
    const result = userSchema.safeParse(FormdataObject);
      

    if(!result.success){
        const fieldsErrors = {};
        result.error.issues.forEach((issue)=>{
          fieldsErrors[issue.path[0]] = issue.message;
        })
        setErrors(fieldsErrors)
        return
    }

    setErrors({});

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      

      try {
        const res = await axios.post("localhost:3000/upload" , formData);
        console.log("Server Response" , res.data);
        alert(res.data.msg);
      }
      catch (error) {
        console.log("Error in sending data" , error)
        alert("Error Sending Data")
      }
      
       

   };
  return (
    <>
      <Navbar/>
       {/* <!-- Main container for the login form --> */}
 <div className="container">
    <div className="box">
      <form onSubmit={handleSubmit} autoComplete='off'>
        {/* <!-- Title section --> */}
        <div className="title">
          <h1>Register Form</h1>
        </div>
        {/* <!-- Input fields container --> */}
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
          {errors.name && <p>{errors.name}</p>}
          <label htmlFor="Email" className="label-color">User email</label>
           <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
          <br />
          {errors.email && <p>{errors.email}</p>}
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
          {errors.password && <p className='label-error'>{errors.password}</p>}
          <br />
          <label htmlFor="image" className='label-color'>Image</label>
         <input
                id='file'      
                type="file"
                name="image"
                required
                // value={image || ""}
                onChange={(e)=>setImage(e.target.files[0])}
         />
         {errors.image && <p>{errors.image}</p>}
        <button type="submit" className='submit-btn'>
        
          Submit
        </button>
         </div>
      </form>
    </div> 
 </div>
    </>
  )
}

export default App

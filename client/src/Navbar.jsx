import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    
  <>{
     <div style={{
        margin: "0px",
        padding:"0px",
        boxSizing:"border-box"
    }}></div>
  }
     <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 25px",
            background: "#1f1f1f",
            color: "white"
        }}>
            <h2 style={{margin:"0"}}>EJS crud </h2>
            <div style={{ display:"flex",gap:"16px"}}>
            <Link to="/">            
              <button style={{
                 padding:"2px 14px",
                 background:"#55dd16",
                 borderRadius:"5px",
                 cursor:"pointer",
                 color:"white"
               }}>
                Register
              </button>
            </Link>
            <Link to="/show">
              <button style={{
                padding:"2px 10px",
                background:"#0463f1",
                borderRadius:"5px",
                cursor:"pointer",
               color:"white"
               }}>
                Show Users
              </button>        
            </Link>       
            </div>
      </nav>
  </>
  )
}

export default Navbar
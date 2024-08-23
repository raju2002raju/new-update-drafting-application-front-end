import React from 'react'
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div className='main_container'   >
        <Link to='new_draft'><button style={{padding:'10px', marginRight:'20px'}}>New Draft</button></Link>
        <Link to='upload_documents'><button style={{padding:'10px'}}>Upload Documents</button></Link>
        </div>
    </div>
  )
}

export default Navbar

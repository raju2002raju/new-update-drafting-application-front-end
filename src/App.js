import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Componets/Home';
import OutputComponent from './Componets/Transcript';
import DraftForm from './Componets/DraftForm';
import './App.css'
import UpdatePrompt from './Componets/UpdatePrompt';

import UploadImagePdf from './Componets/UploadImagePdf';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/new_draft' element={<Home/>}  />
        <Route path='upload_documents' element={<UploadImagePdf/>} />
        <Route path='/output' element={<OutputComponent />} />
        <Route path='/:id/update_prompt' element={<UpdatePrompt/>} />
        <Route path="/draft-form" element={<DraftForm />} />
        
      </Routes>
    </Router>
  );
};

export default App;

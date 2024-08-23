import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const response = await axios.get('https://new-update-drafting-application-back-end.onrender.com/api/documents');
        setAllDocuments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all documents:', error);
        setError(error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };
    fetchAllDocuments();
  }, []);


  const handleSelectChange = async (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      try {
        const response = await axios.get(`https://new-update-drafting-application-back-end.onrender.com/api/documents/fieldName/${selectedValue}`);
        console.log('API response:', JSON.stringify(response.data, null, 2));
  
        if (response.data && response.data.field1 && Array.isArray(response.data.field1)) {
          console.log('field1 data:', JSON.stringify(response.data.field1, null, 2));
          
          const prompts = {};
          response.data.field1.forEach(field => {
            if (field.prompts) {
              // Remove any quotes and escape special characters
              prompts[field.NameOfField] = field.prompts.replace(/["'`]/g, '').replace(/\n/g, '\\n');
            }
          });
  
          console.log('Extracted prompts:', JSON.stringify(prompts, null, 2));
  
          if (Object.keys(prompts).length > 0) {
            try {
              const updateResponse = await axios.post('https://new-update-drafting-application-back-end.onrender.com/updateprompt/update-env', { prompts });
              console.log('Prompts update response:', updateResponse.data);
              console.log('Formatted field names:', updateResponse.data.updatedPrompts);
            } catch (error) {
              console.error('Error updating prompts:', error);
              setError('Failed to update prompts. Please try again.');
              return;
            }
          } else {
            console.warn('No prompts found in the selected document');
            // You might want to set an error state here or handle this case differently
          }
  
          navigate('/draft-form', { state: { formData: response.data } });
        } else {
          console.error('Invalid response data structure:', response.data);
          setError('Invalid data received from server');
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
        setError(error.response ? error.response.data : error.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div className='main_container'>
        <div className='container'>
          <h1>What Do You Want to Draft?</h1>
          <p>Select a topic from the list below:</p>
          <div className='container2'>
            <select onChange={handleSelectChange}>
              <option value=''>What do you want to Draft?</option>
              {allDocuments.map((doc, index) => (
                <option key={index} value={doc.fieldName}>
                  {doc.fieldName || `Field ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
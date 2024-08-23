import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



const UpdatePrompt = () => {
    const [prompt_Court, setPromptCourt] = useState('');
    const [prompt_Title, setPromptTittle] = useState('');
    const [prompt_Facts, setPromptFacts] = useState('');
    const [prompt_Ground, setPromptsGround] = useState('');
    const [prompt_Court_Fee, setPromptCourtFee] = useState('');
    const [prompt_Prayer, setPromptPrayer] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(`/${id}`);
    };

const handleSubmit = () => {
    const promptPayload = {
        prompt_Court: prompt_Court
    };
    fetch('https://update-drafting-application-back-end.onrender.com/apii/update-prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            alert('Prompt updated successfully!');
        })
        .catch(error => {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        });
};

const handleTitle = () => {
    const promptPayload = {
        prompt_Title: prompt_Title
    };
    fetch('https://update-drafting-application-back-end.onrender.com/apii/update-prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            alert('Prompt updated successfully!');
        })
        .catch(error => {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        });
};

const handleFacts = () => {
    const promptPayload = {
        prompt_Facts: prompt_Facts
    };
    fetch('https://update-drafting-application-back-end.onrender.com/apii/update-prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            alert('Prompt updated successfully!');
        })
        .catch(error => {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        });
};

const handleGraound = () => {
    const promptPayload = {
        prompt_Ground: prompt_Ground
    };
    fetch('https://update-drafting-application-back-end.onrender.com/apii/update-prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            alert('Prompt updated successfully!');
        })
        .catch(error => {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        });
};

const handleCourtFee = () => {
    const promptPayload = {
        prompt_Court_Fee: prompt_Court_Fee
    };
    fetch('https://update-drafting-application-back-end.onrender.com/apii/update-prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            alert('Prompt updated successfully!');
        })
        .catch(error => {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        });
};

const handlePrayer = () => {
    const promptPayload = {
        prompt_Prayer: prompt_Prayer
    };

    fetch('https://update-drafting-application-back-end.onrender.com/apii/update-prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            alert('Prompt updated successfully!');
        })
        .catch(error => {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        });
};

  return (
      <div>

      <div className='setting_container'>
       <div>
       <button onClick={handleBackClick}>BACK</button>
      <div className='setting_Container_2'>
        <h1>UPDATE PROMPTS HERE</h1>
        <div>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="prompt_update_box"
                onChange={(e) => setPromptCourt(e.target.value)}
                placeholder='Update Court Prompt here ...............'
              />
              <img 
                src='../Images/arrow.png' 
                className='w-a-30' 
                alt="Arrow icon" 
                onClick={handleSubmit}
                style={{ cursor: 'pointer' }} 
              />
            </div>



            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="prompt_update_box"
                onChange={(e) => setPromptTittle(e.target.value)}
                 placeholder='Update Title Prompt here ...............'
              />
              <img 
                src='../Images/arrow.png' 
                className='w-a-30' 
                alt="Arrow icon" 
                onClick={handleTitle}
                style={{ cursor: 'pointer' }} 
              />
            </div>

            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="prompt_update_box"
                onChange={(e) => setPromptFacts(e.target.value)}
                 placeholder='Update Facts Prompt here ...............'
              />
              <img 
                src='../Images/arrow.png' 
                className='w-a-30' 
                alt="Arrow icon" 
                onClick={handleFacts}
                style={{ cursor: 'pointer' }} 
              />
            </div>

            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="prompt_update_box"
                onChange={(e) => setPromptsGround(e.target.value)}
                 placeholder='Update Ground Prompt here ...............'
              />
              <img 
                src='../Images/arrow.png' 
                className='w-a-30' 
                alt="Arrow icon" 
                onClick={handleGraound}
                style={{ cursor: 'pointer' }} 
              />
            </div>


            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="prompt_update_box"
                onChange={(e) => setPromptCourtFee(e.target.value)}
                 placeholder='Update Court Fees Prompt here ...............'
              />
              <img 
                src='../Images/arrow.png' 
                className='w-a-30' 
                alt="Arrow icon" 
                onClick={handleCourtFee}
                style={{ cursor: 'pointer' }} 
              />
            </div>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="prompt_update_box"
                onChange={(e) => setPromptPrayer(e.target.value)}
                 placeholder='Update Prayer Prompt here ...............'
              />
              <img 
                src='../Images/arrow.png' 
                className='w-a-30' 
                alt="Arrow icon" 
                onClick={handlePrayer}
                style={{ cursor: 'pointer' }} 
              />
            </div>
     
        </div>
      </div>
       </div>
    </div>
      </div>
  );
};

export default UpdatePrompt;

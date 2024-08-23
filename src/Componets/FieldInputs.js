import React, { useRef, useState } from 'react';
import UploadFormField from './UploadFormField';

const FieldInputs = ({ fields }) => {
  const [activeRecording, setActiveRecording] = useState(null);
  const formFieldRefs = useRef([]);

  const handleStartRecording = (index) => {
    setActiveRecording(index);
  };

  const handleStopRecording = () => {
    setActiveRecording(null);
  };


  return (
    <div>
      {fields.map((field, index) => (
        <UploadFormField
          key={index}
          ref={el => (formFieldRefs.current[index] = el)}
          label={field.field}
          example={field.example}
          isRecording={activeRecording === index}
          onStartRecording={() => handleStartRecording(index)}
          onStopRecording={handleStopRecording}
        />
      ))}
      <button
        style={{
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default FieldInputs;

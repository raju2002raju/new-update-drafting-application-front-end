import React from 'react';

const DynamicFieldGenerator = ({ fields }) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    console.error('Invalid or empty data in DynamicFieldGenerator');
    return <div>No fields to display</div>;
  }

  return (
    <div>
      <h2>Dynamic Fields</h2>
      {fields.map((field, index) => (
        <div key={index}>
          <label htmlFor={`field-${index}`}>{field.NameOfField}</label>
          <input
            type="text"
            id={`field-${index}`}
            name={field.NameOfField}
            placeholder={field.ExampleContent}
          />
        </div>
      ))}
    </div>
  );
};

export default DynamicFieldGenerator;
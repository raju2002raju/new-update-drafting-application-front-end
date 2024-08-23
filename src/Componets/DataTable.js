import React, { useState } from 'react';
import FieldInputs from './FieldInputs';

function DataTable({ data }) {
    const [showFieldInputs, setShowFieldInputs] = useState(false);
    console.log('Received data in DataTable:', data);

    if (!data || !data.updatedFields || data.updatedFields.length === 0) {
        console.log('No items in data');
        return <p>No data available</p>;
    }

    if (showFieldInputs) {
        return <FieldInputs fields={data.updatedFields} />;
    }

    return (
        <div className='container_data'>
            <div>
                <h3>Processed Data:</h3>
            </div>
            <div className='table-width'>
                {data.updatedFields.map((updatedField, updatedFieldIndex) => (
                    <div key={updatedFieldIndex}>
                        {updatedField.pageContents.map((page, pageIndex) => (
                            <div key={pageIndex}>
                                <h4>Page {page.pageNumber}</h4>
                                <table style={{ borderCollapse: 'collapse', marginBottom: '20px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid black', padding: '8px' }}>Field</th>
                                            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                                            <th style={{ border: '1px solid black', padding: '8px' }}>Example</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {page.content.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid black', padding: '8px' }}>{item.field || ''}</td>
                                                <td style={{ border: '1px solid black', padding: '8px' }}>{item.description || ''}</td>
                                                <td style={{ border: '1px solid black', padding: '8px' }}>{item.example || ''}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button onClick={() => setShowFieldInputs(true)}>NEXT</button>
        </div>
    );
}

export default DataTable;

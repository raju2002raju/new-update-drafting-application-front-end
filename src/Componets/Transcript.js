import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import JoditEditor from 'jodit-react';


let gumStream = null;
let recorder = null;
let audioContext = null;

const OutputComponent = () => {
  const location = useLocation();
  const { data: initialTranscripts } = location.state || {};
  const [transcripts, setTranscripts] = useState(initialTranscripts || []);
  const [addTranscripts, setAddTranscripts] = useState('');
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [isPreviewMode, setPreviewMode] = useState(false);
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 1200,
    width: 800,
    uploader: {
      insertImageAsBase64URI: true,
    },
    html: true,
  };

  const togglePreview = () => {
    setPreviewMode(true);
  };

  const togglePreviewBack = () => {
    setPreviewMode(false);
  };

  const generateContent = () => {
    let content = '';
    content += `
      <div style="line-height: 40px;">
        <div style="display: flex; justify-content: center; text-align: center; margin-bottom: 60px;">
          <h2>
            ${transcripts[0] || ''}
          </h2>
        </div>
        <div>
          <h4 class="title_div">
            BEFORE THE DISTRICT MAGISTRATE
            <div style="display: flex;" class="title">
              ${transcripts[1] || ''}
            </div>
          </h4>
        </div>
        <h4>I, the above-named deponent solemnly affirm and state on oath as under:</h4>
        ${transcripts.slice(2).map((transcript, index) => `
          <div key="${index}">
            ${transcript}
            ${recordingIndex === index + 2 ? addTranscripts : ''}
          </div>
        `).join('')}
        <h4>Deponent</h4>
        <h4 style="margin-bottom: 50px;">VERIFICATION</h4>
        <h4>I, MJ, the above-named deponent do hereby verify that the contents of this affidavit form paras 1 to 5 are true to the best of my knowledge and belief. Nothing material has been concealed.</h4>
      </div>
    `;
    return content;
  };

  return (
    <div className='output_mainContainer' >
      <div className='output_data'>
        <div className='output_container'>
          {isPreviewMode ? (
            <div
              dangerouslySetInnerHTML={{ __html: generateContent() }}
              className='preview'
            />
          ) : (
            <JoditEditor
              ref={editor}
              value={generateContent()}
              config={config}
              tabIndex={1}
              onChange={newContent => {}}
            />
          )}
        </div>
        <div className='d-affidavit'>
          <p>Do you want to Design Affidavit?</p>
          {isPreviewMode ? (
            <button onClick={togglePreviewBack}>Back</button>
          ) : (
            <button onClick={togglePreview}>Preview</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputComponent;

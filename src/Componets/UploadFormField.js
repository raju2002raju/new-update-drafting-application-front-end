import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import Recorder from './Recorder';
import 'jodit';

let gumStream = null;
let recorder = null;
let audioContext = null;

const UploadFormField = forwardRef(({ label, isRecording, onStartRecording, onStopRecording, onAdd,example }, ref) => {
  const [isPaused, setIsPaused] = useState(false);
  const [transcripts, setTranscripts] = useState('');
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [isEditorVisible, setEditorVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    getTranscripts: () => transcripts,
  }));

  const startRecording = async () => {
    if (!isRecording) {
      onStartRecording();
      setIsPaused(false);
      const constraints = { audio: true, video: false };

      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        gumStream = stream;
        const input = audioContext.createMediaStreamSource(stream);
        recorder = new Recorder(input, { numChannels: 1 });
        recorder.record();
      } catch (err) {
        console.error('Error getting user media:', err);
        onStopRecording();
      }
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      onStopRecording();
      try {
        recorder.stop();
        gumStream.getAudioTracks().forEach(track => track.stop());
        recorder.exportWAV(onStop);
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  };

  const pauseRecording = () => {
    if (recorder && isRecording && !isPaused) {
      recorder.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recorder && isPaused) {
      recorder.record();
      setIsPaused(false);
    }
  };

  const onStop = (blob) => {
    const data = new FormData();
    data.append('wavfile', blob, 'recording.wav');
    data.append('label', label);
    console.log(label)
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    axios.post('http://localhost:8080/api/asr', data, config)
    .then(response => {
      console.log('File uploaded successfully:', response.data);
      setContent(response.data.example || '');
      setTranscripts(response.data.example || '');
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  };

  const handleEdit = () => {
    setEditorVisible(true);
    
  };

  const handleSave = () => {
    setTranscripts(content);
    setEditorVisible(false);
  };

  const handlecross = () => {
    setEditorVisible(false);
  };

  const config = {
    readonly: false,
    height: 300,  
    width: 800,
    uploader: {
      insertImageAsBase64URI: true,
    },
    html: true,
  };


  
    return (
        <div className="form-field">
          <div className='label'>{label}</div>
          <div className='transcript_icons'>
            <div>
              <div
                className='transcript_div_upload'
                dangerouslySetInnerHTML={{ __html: example }}
             ></div>
            </div>
            <div className='icons_container'>
              <div className='icons'>
                {!isRecording ? (
                  <img src='./Images/Mic.png' onClick={startRecording} style={{ marginRight: '10px' }} alt="Start Recording" />
                ) : (
                  <>
                    {isPaused ? (
                      <img src='./Images/Play.png' onClick={resumeRecording} style={{ background: '#acacac' }} alt="Resume Recording" />
                    ) : (
                      <img src='./Images/Pause.png' style={{ background: '#acacac' }} onClick={pauseRecording} alt="Pause Recording" />
                    )}
                    <img src='./Images/Stop.png' onClick={stopRecording} alt="Stop Recording" />
                  </>
                )}
                <img src='./Images/Edit.png' onClick={handleEdit} alt="Edit Transcript" />
              </div>
              {onAdd && <img src='./Images/Paragraph.png' className='addParaIcon' onClick={onAdd} alt="Add Paragraph" />}
            </div>
          </div>
          <div className='popup'>
            {isEditorVisible && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'end', margin: '20px' }}>
                  <img src='./Images/cross_icon.png' onClick={handlecross} alt="Close Editor" />
                </div>
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={newContent => setContent(newContent)}
                  onChange={newContent => {}}
                />
                <div style={{ display: 'flex', justifyContent: 'end', margin: '20px' }}>
                  <button onClick={handleSave}>Save</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      

});

export default UploadFormField;

import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const FieldContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 800px;
`;

const PreviewContainer = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  
`;

const PreviewContent = styled.div`
  & > * {
    margin-bottom: 10px;
  }
`;

const DraftForm = () => {
  const location = useLocation();
  const { formData } = location.state || {};
  const [fields, setFields] = useState(formData?.field1 || []);
  const [isRecording, setIsRecording] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [processingAudio, setProcessingAudio] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  if (!formData || !formData.field1) {
    return <div>No form data available</div>;
  }

  const startRecording = async (index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processAudioWithAI(audioBlob, index);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioWithAI = async (audioBlob, index) => {
    setProcessingAudio(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');
      formData.append('fieldName', formatFieldName(fields[index].NameOfField));

      console.log('Processing audio for field:', fields[index].NameOfField);
      console.log('Formatted field name:', formatFieldName(fields[index].NameOfField));

      const response = await axios.post('https://new-update-drafting-application-back-end.onrender.com/api/process-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Received response from audio processing:', response.data);

      const updatedFields = [...fields];
      updatedFields[index].ExampleContent = response.data.processedText;
      setFields(updatedFields);
    } catch (error) {
      console.error('Error processing audio with AI:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(`Error processing audio: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        setError('Failed to process audio. Please try again.');
      }
    } finally {
      setProcessingAudio(false);
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
  };

  const openTextEditor = (index) => {
    const contentState = ContentState.createFromText(fields[index].ExampleContent);
    setEditorState(EditorState.createWithContent(contentState));
    setEditingField(index);
  };

  const closeTextEditor = () => {
    setEditingField(null);
  };

  const saveEditedContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const plainText = contentState.getPlainText();

    const updatedFields = [...fields];
    updatedFields[editingField].ExampleContent = plainText;
    setFields(updatedFields);

    closeTextEditor();
  };

  const addNewField = (index) => {
    const newField = {
      NameOfField: 'New Field',
      ExampleContent: ''
    };
    const updatedFields = [...fields];
    updatedFields.splice(index + 1, 0, newField);
    setFields(updatedFields);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const renderPreview = () => {
    return (
      <PreviewContainer>
        <h2>{formData.fieldName}</h2>
        {fields.map((field, index) => (
          <div key={index}><br/>
             <PreviewContent dangerouslySetInnerHTML={{ __html: field.ExampleContent }} />
          </div>
        ))}
      </PreviewContainer>
    );
  };

  return (
    <FormContainer>
      <h1>{formData.fieldName}</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {!showPreview ? (
        <>
          {fields.map((field, index) => (
            <FieldContainer key={index}>
              <Label htmlFor={`field-${index}`}>{field.NameOfField}</Label>
              <TextArea
                id={`field-${index}`}
                name={field.NameOfField}
                value={field.ExampleContent}
                onChange={(e) => {
                  const updatedFields = [...fields];
                  updatedFields[index].ExampleContent = e.target.value;
                  setFields(updatedFields);
                }}
              />
              <ButtonContainer>
                <Button 
                  onClick={() => isRecording ? stopRecording() : startRecording(index)}
                  disabled={processingAudio}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button onClick={() => openTextEditor(index)}>Edit</Button>
                <Button onClick={() => addNewField(index)}>Add New Field</Button>
              </ButtonContainer>
              {processingAudio && index === fields.findIndex(f => f.NameOfField === field.NameOfField) && 
                <div>Processing audio...</div>
              }
            </FieldContainer>
          ))}
          <Button onClick={togglePreview}>Preview</Button>
        </>
      ) : (
        <>
          {renderPreview()}
          <Button onClick={togglePreview}>Back to Edit</Button>
        </>
      )}

      {editingField !== null && (
        <Modal>
          <ModalContent>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
            />
            <ButtonContainer>
              <Button onClick={saveEditedContent}>Save</Button>
              <Button onClick={closeTextEditor}>Cancel</Button>
            </ButtonContainer>
          </ModalContent>
        </Modal>
      )}
    </FormContainer>
  );
};

export default DraftForm;
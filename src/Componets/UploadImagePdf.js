import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import axios from 'axios';
import DataTable from './DataTable';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const UploadImagePdf = () => {
  const [extractedText, setExtractedText] = useState([]);
  const [processedText, setProcessedText] = useState([]);
  const [isDataDisplayed, setIsDataDisplayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  useEffect(() => {
    const isAdvancedUpload = (function () {
      const div = document.createElement('div');
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    })();

    if (isAdvancedUpload) {
      const draggableFileArea = document.querySelector(".drag-file-area");
      ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(evt =>
        draggableFileArea.addEventListener(evt, e => {
          e.preventDefault();
          e.stopPropagation();
        })
      );

      ["dragover", "dragenter"].forEach(evt => {
        draggableFileArea.addEventListener(evt, e => {
          e.preventDefault();
          e.stopPropagation();
          document.querySelector(".upload-icon").innerHTML = 'file_download';
          document.querySelector(".dynamic-message").innerHTML = 'Drop your file here!';
        });
      });

      draggableFileArea.addEventListener("drop", e => {
        document.querySelector(".upload-icon").innerHTML = 'check_circle';
        document.querySelector(".dynamic-message").innerHTML = 'File Dropped Successfully!';
        document.querySelector(".label").innerHTML = `drag & drop or <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: -23px; left: -20px;"> browse file</span> </span>`;
        document.querySelector(".upload-button").innerHTML = `Upload`;

        const files = e.dataTransfer.files;
        handleFileChange({ target: { files } });
      });
    }

    document.querySelector(".default-file-input").addEventListener("click", () => {
      document.querySelector(".default-file-input").value = '';
    });

    document.querySelector(".remove-file-icon").addEventListener("click", () => {
      document.querySelector(".file-block").style.display = 'none';
      document.querySelector(".default-file-input").value = '';
      document.querySelector(".upload-icon").innerHTML = 'file_upload';
      document.querySelector(".dynamic-message").innerHTML = 'Drag & drop any file here';
      document.querySelector(".label").innerHTML = `or <span class="browse-files"> <input type="file" class="default-file-input"/> <span class="browse-files-text">browse file</span> <span>from device</span> </span>`;
      document.querySelector(".upload-button").innerHTML = `Upload`;
    });

    document.querySelector(".cancel-alert-button").addEventListener("click", () => {
      document.querySelector(".cannot-upload-message").style.display = 'none';
    });
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;

    if (fileType === 'application/pdf') {
      extractTextFromPDF(file);
    } else if (fileType.startsWith('image/')) {
      extractTextFromImage(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractTextFromDocx(file);
    }

    document.querySelector(".upload-icon").innerHTML = 'check_circle';
    document.querySelector(".dynamic-message").innerHTML = 'File Dropped Successfully!';
    document.querySelector(".label").innerHTML = `drag & drop or <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: 0;"> browse file</span></span>`;
    document.querySelector(".upload-button").innerHTML = `Upload`;
    document.querySelector(".file-name").innerHTML = file.name;
    document.querySelector(".file-size").innerHTML = (file.size / 1024).toFixed(1) + " KB";
    document.querySelector(".file-block").style.display = 'flex';
    document.querySelector(".progress-bar").style.width = 0;
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let textBlocks = [];

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();

        content.items.forEach(item => {
          const lineText = item.str.trim();
          if (lineText) {
            textBlocks.push(lineText);
          }
        });
      }

      setExtractedText(textBlocks);
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromImage = (file) => {
    Tesseract.recognize(file, 'eng')
      .then(({ data: { text } }) => {
        setExtractedText([text]);
      })
      .catch((err) => {
        console.error('Error extracting text from image:', err);
      });
  };

  const extractTextFromDocx = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      mammoth.extractRawText({ arrayBuffer: event.target.result })
        .then((result) => {
          setExtractedText([result.value]);
        })
        .catch((err) => {
          console.error('Error extracting text from DOCX:', err);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleStartClick = async () => {
    if (!extractedText.length) {
      document.querySelector(".cannot-upload-message").style.display = 'flex';
      return;
    }

    setIsLoading(true); // Set loading to true when processing starts

    try {
      const response = await axios.post('http://localhost:8080/text/extract-text', { text: extractedText.join('\n') });
      if (typeof response.data === 'object' && response.data !== null) {
        setProcessedText(response.data);
        setIsDataDisplayed(true);
      } else {
        setProcessedText({});
      }
    } catch (error) {
      console.error('Error sending text to the server:', error);
      setProcessedText({});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className='container_data'>
      {!isDataDisplayed ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <form className="form-container" encType='multipart/form-data'>
            <div className="upload-files-container">
              <div className="drag-file-area">
                <span className="material-icons-outlined upload-icon"> file_upload </span>
                <h3 className="dynamic-message"> Drag & drop any file here </h3>
                <label className="label">
                  or <span className="browse-files">
                    <input type="file" onChange={handleFileChange} className="default-file-input" />
                    <span className="browse-files-text">browse file</span> <span>from device</span>
                  </span>
                </label>
              </div>
              <span className="cannot-upload-message">
                <span className="material-icons-outlined">error</span> Please select a file first
                <span className="material-icons-outlined cancel-alert-button">cancel</span>
              </span>
              <div className="file-block">
                <div className="file-info">
                  <span className="material-icons-outlined file-icon">description</span>
                  <span className="file-name"></span> | <span className="file-size"></span>
                </div>
                <span className="material-icons remove-file-icon">delete</span>
                <div className="progress-bar"></div>
              </div>
              <button
                type="button"
                className="upload-button"
                onClick={handleStartClick}
                disabled={!extractedText.length || isLoading}
                style={{ marginTop: '20px' }}
              >
                {isLoading ? 'Processing...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <DataTable data={processedText} />
      )}
    </div>
  );
};

export default UploadImagePdf;

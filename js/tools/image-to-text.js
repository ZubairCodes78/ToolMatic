// Image to Text (OCR) Tool
document.addEventListener('DOMContentLoaded', function() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const extractBtn = document.getElementById('extractBtn');
  const changeImageBtn = document.getElementById('changeImageBtn');
  const loadingContainer = document.getElementById('loadingContainer');
  const loadingProgress = document.getElementById('loadingProgress');
  const outputContainer = document.getElementById('outputContainer');
  const outputText = document.getElementById('outputText');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');

  let currentFile = null;

  // Click to upload
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });

  // Drag and drop events
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  // File input change
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Handle file selection
  function handleFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image file.');
      return;
    }

    currentFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      uploadArea.style.display = 'none';
      previewContainer.style.display = 'block';
      outputContainer.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Change image button
  changeImageBtn.addEventListener('click', function() {
    fileInput.value = '';
    currentFile = null;
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'block';
    outputContainer.style.display = 'none';
    outputText.value = '';
    updateStats('');
  });

  // Extract text button
  extractBtn.addEventListener('click', function() {
    if (!currentFile) {
      alert('Please upload an image first.');
      return;
    }

    // Show loading
    previewContainer.style.display = 'none';
    loadingContainer.style.display = 'block';
    loadingProgress.textContent = '0%';

    // Perform OCR
    performOCR(currentFile);
  });

  // Perform OCR using Tesseract.js
  async function performOCR(file) {
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: function(m) {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              loadingProgress.textContent = progress + '%';
            }
          }
        }
      );

      // Hide loading, show output
      loadingContainer.style.display = 'none';
      outputContainer.style.display = 'block';
      previewContainer.style.display = 'block';

      // Set output text
      const extractedText = result.data.text;
      outputText.value = extractedText;

      // Update stats
      updateStats(extractedText);

    } catch (error) {
      console.error('OCR Error:', error);
      loadingContainer.style.display = 'none';
      previewContainer.style.display = 'block';
      alert('Error extracting text. Please try again with a clearer image.');
    }
  }

  // Update word and character count
  function updateStats(text) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;

    wordCount.textContent = words.length.toLocaleString();
    charCount.textContent = characters.toLocaleString();
  }

  // Copy text button
  copyBtn.addEventListener('click', function() {
    outputText.select();
    document.execCommand('copy');
    
    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(function() {
      copyBtn.textContent = originalText;
    }, 2000);
  });

  // Download as TXT button
  downloadBtn.addEventListener('click', function() {
    const text = outputText.value;
    if (!text.trim()) {
      alert('No text to download.');
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Clear button
  clearBtn.addEventListener('click', function() {
    outputText.value = '';
    updateStats('');
    fileInput.value = '';
    currentFile = null;
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'block';
    outputContainer.style.display = 'none';
  });
});

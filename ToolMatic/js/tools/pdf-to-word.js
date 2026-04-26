// PDF to Word Converter
document.addEventListener('DOMContentLoaded', function() {
  // Set PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const convertBtn = document.getElementById('convertBtn');
  const changeFileBtn = document.getElementById('changeFileBtn');
  const loadingContainer = document.getElementById('loadingContainer');
  const loadingProgress = document.getElementById('loadingProgress');
  const successContainer = document.getElementById('successContainer');
  const downloadBtn = document.getElementById('downloadBtn');
  const convertAnotherBtn = document.getElementById('convertAnotherBtn');

  let currentFile = null;
  let convertedBlob = null;

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
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    currentFile = file;

    // Show file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    uploadArea.style.display = 'none';
    fileInfo.style.display = 'block';
    successContainer.style.display = 'none';
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Change file button
  changeFileBtn.addEventListener('click', function() {
    fileInput.value = '';
    currentFile = null;
    fileInfo.style.display = 'none';
    uploadArea.style.display = 'block';
    successContainer.style.display = 'none';
  });

  // Convert button
  convertBtn.addEventListener('click', function() {
    if (!currentFile) {
      alert('Please upload a PDF file first.');
      return;
    }

    startConversion();
  });

  // Start conversion
  async function startConversion() {
    fileInfo.style.display = 'none';
    loadingContainer.style.display = 'block';
    loadingProgress.textContent = '0%';

    try {
      // Read PDF file
      const arrayBuffer = await currentFile.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text items
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
        
        // Update progress
        const progress = Math.round((i / totalPages) * 100);
        loadingProgress.textContent = progress + '%';
      }

      // Create Word document
      const doc = new docx.Document({
        sections: [{
          properties: {},
          children: [
            new docx.Paragraph({
              text: fullText.trim(),
              spacing: {
                after: 200
              }
            })
          ]
        }]
      });

      // Generate blob
      const blob = await docx.Packer.toBlob(doc);
      convertedBlob = blob;

      // Show success
      loadingContainer.style.display = 'none';
      successContainer.style.display = 'block';

    } catch (error) {
      console.error('Conversion Error:', error);
      loadingContainer.style.display = 'none';
      fileInfo.style.display = 'block';
      alert('Error converting PDF. Please try again with a different file. Note: This converter works best with text-based PDFs. Scanned documents or image-based PDFs may not convert properly.');
    }
  }

  // Download button
  downloadBtn.addEventListener('click', function() {
    if (!convertedBlob) {
      alert('No converted file available.');
      return;
    }

    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename
    const originalName = currentFile.name.replace('.pdf', '');
    a.download = originalName + '.docx';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Convert another button
  convertAnotherBtn.addEventListener('click', function() {
    fileInput.value = '';
    currentFile = null;
    convertedBlob = null;
    successContainer.style.display = 'none';
    uploadArea.style.display = 'block';
  });
});

// Sitemap Generator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('urlInput');
  const lastModified = document.getElementById('lastModified');
  const changeFreq = document.getElementById('changeFreq');
  const priority = document.getElementById('priority');
  const addUrlBtn = document.getElementById('addUrlBtn');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const urlList = document.getElementById('urlList');
  const urlListItems = document.getElementById('urlListItems');
  const outputArea = document.getElementById('outputArea');
  const outputContent = document.getElementById('outputContent');
  const errorMessage = document.getElementById('errorMessage');

  // Set default date to today
  const today = new Date();
  lastModified.value = formatDate(today);

  let urls = [];

  // Add URL to list
  addUrlBtn.addEventListener('click', function() {
    hideError('errorMessage');
    
    const url = urlInput.value.trim();
    
    if (!url) {
      showError('errorMessage', 'Please enter a URL.');
      return;
    }
    
    if (!isValidUrl(url)) {
      showError('errorMessage', 'Please enter a valid URL (must start with http:// or https://).');
      return;
    }
    
    // Check for duplicates
    if (urls.some(u => u.url === url)) {
      showError('errorMessage', 'This URL is already in the list.');
      return;
    }
    
    const urlData = {
      url: url,
      lastMod: lastModified.value || formatDate(new Date()),
      changeFreq: changeFreq.value,
      priority: parseFloat(priority.value) || 0.5
    };
    
    urls.push(urlData);
    
    // Update UI
    urlList.style.display = 'block';
    renderUrlList();
    
    // Clear input
    urlInput.value = '';
    priority.value = '0.5';
  });
  
  // Render URL list
  function renderUrlList() {
    urlListItems.innerHTML = '';
    
    urls.forEach((urlData, index) => {
      const item = document.createElement('div');
      item.className = 'url-list-item';
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(urlData.url)}</strong><br>
          <small>Priority: ${urlData.priority} | Change Freq: ${urlData.changeFreq}</small>
        </div>
        <button class="btn btn-secondary" data-index="${index}" style="padding: 6px 12px; font-size: 0.875rem;">Remove</button>
      `;
      urlListItems.appendChild(item);
    });
    
    // Add remove event listeners
    document.querySelectorAll('.url-list-item button').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        urls.splice(index, 1);
        renderUrlList();
        
        if (urls.length === 0) {
          urlList.style.display = 'none';
        }
      });
    });
  }
  
  // Generate sitemap
  generateBtn.addEventListener('click', function() {
    hideError('errorMessage');
    
    if (urls.length === 0) {
      showError('errorMessage', 'Please add at least one URL to the sitemap.');
      return;
    }
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(urlData => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${escapeHtml(urlData.url)}</loc>\n`;
      sitemap += `    <lastmod>${urlData.lastMod}</lastmod>\n`;
      sitemap += `    <changefreq>${urlData.changeFreq}</changefreq>\n`;
      sitemap += `    <priority>${urlData.priority.toFixed(1)}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    outputContent.textContent = sitemap;
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  
  // Clear all
  clearBtn.addEventListener('click', function() {
    urls = [];
    urlList.style.display = 'none';
    urlListItems.innerHTML = '';
    outputArea.style.display = 'none';
    urlInput.value = '';
    priority.value = '0.5';
    lastModified.value = formatDate(new Date());
    hideError('errorMessage');
  });
  
  // Download sitemap
  downloadBtn.addEventListener('click', function() {
    const content = outputContent.textContent;
    if (!content) {
      showError('errorMessage', 'Please generate a sitemap first before downloading.');
      return;
    }
    downloadTextAsFile(content, 'sitemap.xml');
  });
  
  // Utility function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

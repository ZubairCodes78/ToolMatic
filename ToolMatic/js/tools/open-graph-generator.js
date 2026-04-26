// Open Graph Generator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const ogTitle = document.getElementById('ogTitle');
  const ogDescription = document.getElementById('ogDescription');
  const ogUrl = document.getElementById('ogUrl');
  const ogImage = document.getElementById('ogImage');
  const ogType = document.getElementById('ogType');
  const ogSiteName = document.getElementById('ogSiteName');
  const twitterCardType = document.getElementById('twitterCardType');
  const twitterTitle = document.getElementById('twitterTitle');
  const twitterDescription = document.getElementById('twitterDescription');
  const twitterImage = document.getElementById('twitterImage');
  const twitterSite = document.getElementById('twitterSite');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputArea = document.getElementById('outputArea');
  const outputContent = document.getElementById('outputContent');
  const previewArea = document.getElementById('previewArea');
  const previewTitle = document.getElementById('previewTitle');
  const previewDescription = document.getElementById('previewDescription');
  const previewImage = document.getElementById('previewImage');
  const previewDomain = document.getElementById('previewDomain');
  const ogTitleCounter = document.getElementById('ogTitleCounter');
  const ogDescCounter = document.getElementById('ogDescCounter');
  const errorMessage = document.getElementById('errorMessage');

  // Character counters
  ogTitle.addEventListener('input', function() {
    const count = this.value.length;
    ogTitleCounter.textContent = `${count}/60`;
    if (count > 60) {
      ogTitleCounter.classList.add('over-limit');
    } else {
      ogTitleCounter.classList.remove('over-limit');
    }
  });

  ogDescription.addEventListener('input', function() {
    const count = this.value.length;
    ogDescCounter.textContent = `${count}/200`;
    if (count > 200) {
      ogDescCounter.classList.add('over-limit');
    } else {
      ogDescCounter.classList.remove('over-limit');
    }
  });

  // Generate tags
  generateBtn.addEventListener('click', function() {
    hideError('errorMessage');
    
    if (!ogTitle.value.trim()) {
      showError('errorMessage', 'Please enter an OG title.');
      return;
    }

    if (!ogUrl.value.trim()) {
      showError('errorMessage', 'Please enter an OG URL.');
      return;
    }

    if (ogUrl.value.trim() && !isValidUrl(ogUrl.value)) {
      showError('errorMessage', 'Please enter a valid OG URL (must start with http:// or https://).');
      return;
    }

    let metaTags = '';
    
    // Open Graph Tags
    metaTags += `<!-- Open Graph Tags -->\n`;
    metaTags += `<meta property="og:title" content="${escapeHtml(ogTitle.value)}">\n`;
    
    if (ogDescription.value.trim()) {
      metaTags += `<meta property="og:description" content="${escapeHtml(ogDescription.value)}">\n`;
    }
    
    metaTags += `<meta property="og:url" content="${escapeHtml(ogUrl.value)}">\n`;
    
    if (ogImage.value.trim()) {
      if (isValidUrl(ogImage.value)) {
        metaTags += `<meta property="og:image" content="${escapeHtml(ogImage.value)}">\n`;
      } else {
        showError('errorMessage', 'Please enter a valid OG image URL (must start with http:// or https://).');
        return;
      }
    }
    
    metaTags += `<meta property="og:type" content="${ogType.value}">\n`;
    
    if (ogSiteName.value.trim()) {
      metaTags += `<meta property="og:site_name" content="${escapeHtml(ogSiteName.value)}">\n`;
    }
    
    // Twitter Card Tags
    metaTags += `\n<!-- Twitter Card Tags -->\n`;
    metaTags += `<meta name="twitter:card" content="${twitterCardType.value}">\n`;
    
    const twitterTitleValue = twitterTitle.value.trim() || ogTitle.value;
    metaTags += `<meta name="twitter:title" content="${escapeHtml(twitterTitleValue)}">\n`;
    
    const twitterDescValue = twitterDescription.value.trim() || ogDescription.value;
    if (twitterDescValue) {
      metaTags += `<meta name="twitter:description" content="${escapeHtml(twitterDescValue)}">\n`;
    }
    
    const twitterImageValue = twitterImage.value.trim() || ogImage.value;
    if (twitterImageValue) {
      metaTags += `<meta name="twitter:image" content="${escapeHtml(twitterImageValue)}">\n`;
    }
    
    if (twitterSite.value.trim()) {
      metaTags += `<meta name="twitter:site" content="${escapeHtml(twitterSite.value)}">\n`;
    }
    
    outputContent.textContent = metaTags;
    outputArea.style.display = 'block';
    
    // Update preview
    previewTitle.textContent = ogTitle.value || 'Your Page Title';
    previewDescription.textContent = ogDescription.value || 'Your page description will appear here...';
    
    if (ogImage.value) {
      previewImage.innerHTML = `<img src="${escapeHtml(ogImage.value)}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.textContent='Image failed to load'">`;
    } else {
      previewImage.textContent = 'Image Preview';
    }
    
    if (ogUrl.value) {
      try {
        const urlObj = new URL(ogUrl.value);
        previewDomain.textContent = urlObj.hostname.toUpperCase();
      } catch (e) {
        previewDomain.textContent = 'EXAMPLE.COM';
      }
    } else {
      previewDomain.textContent = 'EXAMPLE.COM';
    }
    
    previewArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    ogTitle.value = '';
    ogDescription.value = '';
    ogUrl.value = '';
    ogImage.value = '';
    ogType.value = 'website';
    ogSiteName.value = '';
    twitterCardType.value = 'summary';
    twitterTitle.value = '';
    twitterDescription.value = '';
    twitterImage.value = '';
    twitterSite.value = '';
    ogTitleCounter.textContent = '0/60';
    ogDescCounter.textContent = '0/200';
    ogTitleCounter.classList.remove('over-limit');
    ogDescCounter.classList.remove('over-limit');
    outputArea.style.display = 'none';
    previewArea.style.display = 'none';
    hideError('errorMessage');
  });

  // Utility function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

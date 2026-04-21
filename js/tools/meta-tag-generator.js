// Meta Tag Generator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const pageTitle = document.getElementById('pageTitle');
  const metaDescription = document.getElementById('metaDescription');
  const keywords = document.getElementById('keywords');
  const author = document.getElementById('author');
  const robots = document.getElementById('robots');
  const canonicalUrl = document.getElementById('canonicalUrl');
  const viewport = document.getElementById('viewport');
  const charset = document.getElementById('charset');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputArea = document.getElementById('outputArea');
  const outputContent = document.getElementById('outputContent');
  const titleCounter = document.getElementById('titleCounter');
  const descCounter = document.getElementById('descCounter');
  const errorMessage = document.getElementById('errorMessage');

  // Character counters
  pageTitle.addEventListener('input', function() {
    const count = this.value.length;
    titleCounter.textContent = `${count}/60`;
    if (count > 60) {
      titleCounter.classList.add('over-limit');
    } else {
      titleCounter.classList.remove('over-limit');
    }
  });

  metaDescription.addEventListener('input', function() {
    const count = this.value.length;
    descCounter.textContent = `${count}/160`;
    if (count > 160) {
      descCounter.classList.add('over-limit');
    } else {
      descCounter.classList.remove('over-limit');
    }
  });

  // Generate meta tags
  generateBtn.addEventListener('click', function() {
    hideError('errorMessage');
    
    if (!pageTitle.value.trim()) {
      showError('errorMessage', 'Please enter a page title.');
      return;
    }

    let metaTags = '';
    
    // Charset
    metaTags += `<meta charset="${charset.value}">\n`;
    
    // Viewport
    metaTags += `<meta name="viewport" content="${viewport.value}">\n\n`;
    
    // Title
    metaTags += `<title>${escapeHtml(pageTitle.value)}</title>\n\n`;
    
    // Description
    if (metaDescription.value.trim()) {
      metaTags += `<meta name="description" content="${escapeHtml(metaDescription.value)}">\n`;
    }
    
    // Keywords
    if (keywords.value.trim()) {
      metaTags += `<meta name="keywords" content="${escapeHtml(keywords.value)}">\n`;
    }
    
    // Author
    if (author.value.trim()) {
      metaTags += `<meta name="author" content="${escapeHtml(author.value)}">\n`;
    }
    
    // Robots
    metaTags += `<meta name="robots" content="${robots.value}">\n`;
    
    // Canonical
    if (canonicalUrl.value.trim()) {
      if (isValidUrl(canonicalUrl.value)) {
        metaTags += `<link rel="canonical" href="${escapeHtml(canonicalUrl.value)}">`;
      } else {
        showError('errorMessage', 'Please enter a valid canonical URL (must start with http:// or https://).');
        return;
      }
    }
    
    outputContent.textContent = metaTags;
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    pageTitle.value = '';
    metaDescription.value = '';
    keywords.value = '';
    author.value = '';
    canonicalUrl.value = '';
    robots.value = 'index,follow';
    titleCounter.textContent = '0/60';
    descCounter.textContent = '0/160';
    titleCounter.classList.remove('over-limit');
    descCounter.classList.remove('over-limit');
    outputArea.style.display = 'none';
    hideError('errorMessage');
  });

  // Utility function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

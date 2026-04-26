// Robots.txt Generator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const userAgent = document.getElementById('userAgent');
  const customUserAgent = document.getElementById('customUserAgent');
  const customUserAgentGroup = document.getElementById('customUserAgentGroup');
  const allowPaths = document.getElementById('allowPaths');
  const disallowPaths = document.getElementById('disallowPaths');
  const sitemapUrl = document.getElementById('sitemapUrl');
  const crawlDelay = document.getElementById('crawlDelay');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const outputArea = document.getElementById('outputArea');
  const outputContent = document.getElementById('outputContent');
  const errorMessage = document.getElementById('errorMessage');

  // Show/hide custom user-agent input
  userAgent.addEventListener('change', function() {
    if (this.value === 'custom') {
      customUserAgentGroup.style.display = 'block';
    } else {
      customUserAgentGroup.style.display = 'none';
    }
  });

  // Generate robots.txt
  generateBtn.addEventListener('click', function() {
    hideError('errorMessage');
    
    let robotsContent = '';
    
    // User-agent
    const userAgentValue = userAgent.value === 'custom' ? customUserAgent.value.trim() : userAgent.value;
    if (!userAgentValue) {
      showError('errorMessage', 'Please enter a custom user-agent name.');
      return;
    }
    robotsContent += `User-agent: ${userAgentValue}\n`;
    
    // Disallow paths
    const disallowLines = disallowPaths.value.trim().split('\n').filter(line => line.trim());
    if (disallowLines.length > 0) {
      disallowLines.forEach(path => {
        let cleanPath = path.trim();
        if (!cleanPath.startsWith('/')) {
          cleanPath = '/' + cleanPath;
        }
        robotsContent += `Disallow: ${cleanPath}\n`;
      });
    } else {
      robotsContent += `Disallow:\n`;
    }
    
    // Allow paths
    const allowLines = allowPaths.value.trim().split('\n').filter(line => line.trim());
    if (allowLines.length > 0) {
      allowLines.forEach(path => {
        let cleanPath = path.trim();
        if (!cleanPath.startsWith('/')) {
          cleanPath = '/' + cleanPath;
        }
        robotsContent += `Allow: ${cleanPath}\n`;
      });
    }
    
    // Crawl-delay
    if (crawlDelay.value.trim()) {
      const delay = parseFloat(crawlDelay.value);
      if (delay >= 0) {
        robotsContent += `Crawl-delay: ${delay}\n`;
      }
    }
    
    // Sitemap
    if (sitemapUrl.value.trim()) {
      if (isValidUrl(sitemapUrl.value)) {
        robotsContent += `\nSitemap: ${sitemapUrl.value.trim()}`;
      } else {
        showError('errorMessage', 'Please enter a valid sitemap URL (must start with http:// or https://).');
        return;
      }
    }
    
    outputContent.textContent = robotsContent;
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    userAgent.value = '*';
    customUserAgent.value = '';
    customUserAgentGroup.style.display = 'none';
    allowPaths.value = '';
    disallowPaths.value = '';
    sitemapUrl.value = '';
    crawlDelay.value = '';
    outputArea.style.display = 'none';
    hideError('errorMessage');
  });

  // Download robots.txt
  downloadBtn.addEventListener('click', function() {
    const content = outputContent.textContent;
    if (!content) {
      showError('errorMessage', 'Please generate robots.txt first before downloading.');
      return;
    }
    downloadTextAsFile(content, 'robots.txt');
  });
});

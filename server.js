const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Rewrite rules from vercel.json
const rewrites = [
  { source: '/', destination: '/index.html' },
  { source: '/resume-builder', destination: '/resume-builder.html' },
  { source: '/resume-builder.html', destination: '/resume-builder.html' },
  { source: '/image-to-text', destination: '/image-to-text.html' },
  { source: '/image-to-text.html', destination: '/image-to-text.html' },
  { source: '/pdf-to-word', destination: '/pdf-to-word.html' },
  { source: '/pdf-to-word.html', destination: '/pdf-to-word.html' },
  { source: '/about', destination: '/pages/about.html' },
  { source: '/about.html', destination: '/pages/about.html' },
  { source: '/calculators', destination: '/pages/calculators.html' },
  { source: '/calculators.html', destination: '/pages/calculators.html' },
  { source: '/contact', destination: '/pages/contact.html' },
  { source: '/contact.html', destination: '/pages/contact.html' },
  { source: '/disclaimer', destination: '/pages/disclaimer.html' },
  { source: '/disclaimer.html', destination: '/pages/disclaimer.html' },
  { source: '/privacy-policy', destination: '/pages/privacy-policy.html' },
  { source: '/privacy-policy.html', destination: '/pages/privacy-policy.html' },
  { source: '/terms-of-service', destination: '/pages/terms-of-service.html' },
  { source: '/terms-of-service.html', destination: '/pages/terms-of-service.html' },
  { source: '/seo-tools', destination: '/pages/seo-tools.html' },
  { source: '/seo-tools.html', destination: '/pages/seo-tools.html' },
  { source: '/blog', destination: '/pages/blog/index.html' },
  { source: '/blog/', destination: '/pages/blog/index.html' }
];

function applyRewrites(reqPath) {
  // Check exact matches
  for (const rewrite of rewrites) {
    if (reqPath === rewrite.source) {
      return rewrite.destination;
    }
  }
  
  // Check pattern matches for /blog/:path* and /tools/:path*
  if (reqPath.startsWith('/blog/') && reqPath !== '/blog/' && reqPath !== '/blog') {
    const pathPart = reqPath.substring(6); // Remove '/blog/'
    return `/pages/blog/${pathPart}.html`;
  }
  
  if (reqPath.startsWith('/tools/')) {
    const pathPart = reqPath.substring(7); // Remove '/tools/'
    return `/pages/tools/${pathPart}.html`;
  }
  
  return reqPath;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let filePath = applyRewrites(parsedUrl.pathname);
  
  if (filePath === '/') filePath = '/index.html';
  if (!filePath.startsWith('.')) filePath = '.' + filePath;

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./index.html', (error, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

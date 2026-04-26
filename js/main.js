// Toolmatic Main JavaScript

// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function() {
      navbarToggle.classList.toggle('active');
      navbarMenu.classList.toggle('open');
    });
  }

  // Close mobile menu when clicking a link
  const navbarMenuLinks = document.querySelectorAll('.navbar-menu-link, .navbar-menu-cta');
  navbarMenuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navbarToggle && navbarMenu) {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('open');
      }
    });
  });

  // Copy to Clipboard functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const textToCopy = targetElement.textContent || targetElement.value;
        
        navigator.clipboard.writeText(textToCopy).then(function() {
          const originalText = button.textContent;
          button.textContent = 'Copied ✓';
          
          setTimeout(function() {
            button.textContent = originalText;
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy: ', err);
        });
      }
    });
  });

  // Smooth scroll to output
  const scrollButtons = document.querySelectorAll('.scroll-to-output');
  scrollButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabGroup = this.closest('.tabs');
      const tabContents = tabGroup.nextElementSibling;
      
      // Remove active class from all tabs in this group
      tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all tab contents
      tabContents.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show corresponding tab content
      const tabId = this.getAttribute('data-tab');
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('.accordion-icon');
      
      content.classList.toggle('open');
      icon.classList.toggle('open');
    });
  });

  // Set active nav link based on current page
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-link, .navbar-menu-link');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || (currentPath.includes(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });
});

// Utility function to show error messages
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
}

// Utility function to hide error messages
function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.classList.remove('visible');
  }
}

// Utility function to validate URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Utility function to format date
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Utility function to download text as file
function downloadTextAsFile(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

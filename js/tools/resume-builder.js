// Resume Builder
console.log('[Resume Builder] Script loaded');
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Resume Builder] DOMContentLoaded fired');
  // Form elements
  const fullName = document.getElementById('fullName');
  const jobTitle = document.getElementById('jobTitle');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');
  const summary = document.getElementById('summary');
  const skillInput = document.getElementById('skillInput');
  const addSkillBtn = document.getElementById('addSkillBtn');
  const skillsContainer = document.getElementById('skillsContainer');
  const addEducationBtn = document.getElementById('addEducationBtn');
  const educationContainer = document.getElementById('educationContainer');
  const addExperienceBtn = document.getElementById('addExperienceBtn');
  const experienceContainer = document.getElementById('experienceContainer');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const projectsContainer = document.getElementById('projectsContainer');
  const clearAllBtn = document.getElementById('clearAllBtn');
  
  // Preview elements
  const previewName = document.getElementById('previewName');
  const previewTitle = document.getElementById('previewTitle');
  const previewContact = document.getElementById('previewContact');
  const previewSummary = document.getElementById('previewSummary');
  const previewSkills = document.getElementById('previewSkills');
  const previewEducation = document.getElementById('previewEducation');
  const previewExperience = document.getElementById('previewExperience');
  const previewProjects = document.getElementById('previewProjects');
  
  // Template elements
  const templateBtns = document.querySelectorAll('.template-btn');
  const resumePreview = document.getElementById('resumePreview');
  
  // Action buttons
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const editResumeBtn = document.getElementById('editResumeBtn');
  const previewResumeBtn = document.getElementById('previewResumeBtn');
  const previewModal = document.getElementById('previewModal');
  const closeModal = document.getElementById('closeModal');
  
  // Debug: Check if elements exist
  console.log('[Debug] downloadPdfBtn:', downloadPdfBtn);
  console.log('[Debug] html2pdf available:', typeof html2pdf !== 'undefined');
  
  // Data storage
  let skills = [];
  let educations = [];
  let experiences = [];
  let projects = [];
  let educationCount = 0;
  let experienceCount = 0;
  let projectCount = 0;
  
  // Update preview function
  function updatePreview() {
    // Personal Information
    previewName.textContent = fullName.value || 'Your Name';
    previewTitle.textContent = jobTitle.value || 'Job Title';
    previewContact.textContent = [
      email.value || '',
      phone.value || '',
      address.value || ''
    ].filter(Boolean).join(' | ') || 'email@example.com';
    previewSummary.textContent = summary.value || 'Your professional summary will appear here...';
    
    // Skills
    if (skills.length > 0) {
      previewSkills.innerHTML = skills.map(skill => 
        `<span class="skill-item">${skill}</span>`
      ).join('');
    } else {
      previewSkills.textContent = 'Add your skills...';
    }
    
    // Education
    if (educations.length > 0) {
      previewEducation.innerHTML = educations.map(edu => `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; color: #111827;">${edu.degree}</div>
          <div style="color: #374151;">${edu.institution}</div>
          <div style="color: #6B7280; font-size: 0.875rem;">${edu.dates || ''}</div>
        </div>
      `).join('');
    } else {
      previewEducation.textContent = 'Add your education...';
    }
    
    // Experience
    if (experiences.length > 0) {
      previewExperience.innerHTML = experiences.map(exp => `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; color: #111827;">${exp.title}</div>
          <div style="color: #374151;">${exp.company}</div>
          <div style="color: #6B7280; font-size: 0.875rem;">${exp.dates || ''}</div>
          <div style="color: #4B5563; font-size: 0.875rem; margin-top: 4px;">${exp.description}</div>
        </div>
      `).join('');
    } else {
      previewExperience.textContent = 'Add your experience...';
    }
    
    // Projects
    if (projects.length > 0) {
      previewProjects.innerHTML = projects.map(proj => `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; color: #111827;">${proj.name}</div>
          <div style="color: #4B5563; font-size: 0.875rem; margin-top: 4px;">${proj.description}</div>
        </div>
      `).join('');
    } else {
      previewProjects.textContent = 'Add your projects...';
    }
  }
  
  // Add event listeners to all form inputs
  const formInputs = [fullName, jobTitle, email, phone, address, summary];
  formInputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  // Skills functionality
  addSkillBtn.addEventListener('click', addSkill);
  skillInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  });
  
  function addSkill() {
    const skill = skillInput.value.trim();
    if (skill && !skills.includes(skill)) {
      skills.push(skill);
      renderSkills();
      skillInput.value = '';
      updatePreview();
    }
  }
  
  function renderSkills() {
    skillsContainer.innerHTML = skills.map((skill, index) => `
      <div class="skill-tag">
        ${skill}
        <button onclick="removeSkill(${index})">&times;</button>
      </div>
    `).join('');
  }
  
  window.removeSkill = function(index) {
    skills.splice(index, 1);
    renderSkills();
    updatePreview();
  };
  
  // Education functionality
  addEducationBtn.addEventListener('click', addEducation);
  
  function addEducation() {
    educationCount++;
    const eduDiv = document.createElement('div');
    eduDiv.className = 'dynamic-section';
    eduDiv.id = `education-${educationCount}`;
    eduDiv.innerHTML = `
      <div class="dynamic-section-header">
        <h4>Education #${educationCount}</h4>
        <button class="remove-btn" onclick="removeEducation(${educationCount})">Remove</button>
      </div>
      <div class="form-group">
        <label>Degree *</label>
        <input type="text" class="edu-degree" placeholder="Bachelor of Science in Computer Science">
      </div>
      <div class="form-group">
        <label>Institution *</label>
        <input type="text" class="edu-institution" placeholder="University Name">
      </div>
      <div class="form-group">
        <label>Dates *</label>
        <input type="text" class="edu-dates" placeholder="2018 - 2022">
      </div>
    `;
    educationContainer.appendChild(eduDiv);
    
    // Add event listeners to new inputs
    eduDiv.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', updateEducationData);
    });
  }
  
  window.removeEducation = function(id) {
    const eduDiv = document.getElementById(`education-${id}`);
    if (eduDiv) {
      eduDiv.remove();
      updateEducationData();
    }
  };
  
  function updateEducationData() {
    educations = [];
    document.querySelectorAll('#educationContainer .dynamic-section').forEach(eduDiv => {
      const degree = eduDiv.querySelector('.edu-degree').value;
      const institution = eduDiv.querySelector('.edu-institution').value;
      const dates = eduDiv.querySelector('.edu-dates').value;
      if (degree && institution) {
        educations.push({ degree, institution, dates });
      }
    });
    updatePreview();
  }
  
  // Experience functionality
  addExperienceBtn.addEventListener('click', addExperience);
  
  function addExperience() {
    experienceCount++;
    const expDiv = document.createElement('div');
    expDiv.className = 'dynamic-section';
    expDiv.id = `experience-${experienceCount}`;
    expDiv.innerHTML = `
      <div class="dynamic-section-header">
        <h4>Experience #${experienceCount}</h4>
        <button class="remove-btn" onclick="removeExperience(${experienceCount})">Remove</button>
      </div>
      <div class="form-group">
        <label>Job Title *</label>
        <input type="text" class="exp-title" placeholder="Software Engineer">
      </div>
      <div class="form-group">
        <label>Company *</label>
        <input type="text" class="exp-company" placeholder="Company Name">
      </div>
      <div class="form-group">
        <label>Dates *</label>
        <input type="text" class="exp-dates" placeholder="2020 - Present">
      </div>
      <div class="form-group">
        <label>Description *</label>
        <textarea class="exp-description" placeholder="Describe your responsibilities and achievements..."></textarea>
      </div>
    `;
    experienceContainer.appendChild(expDiv);
    
    // Add event listeners to new inputs
    expDiv.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', updateExperienceData);
    });
  }
  
  window.removeExperience = function(id) {
    const expDiv = document.getElementById(`experience-${id}`);
    if (expDiv) {
      expDiv.remove();
      updateExperienceData();
    }
  };
  
  function updateExperienceData() {
    experiences = [];
    document.querySelectorAll('#experienceContainer .dynamic-section').forEach(expDiv => {
      const title = expDiv.querySelector('.exp-title').value;
      const company = expDiv.querySelector('.exp-company').value;
      const dates = expDiv.querySelector('.exp-dates').value;
      const description = expDiv.querySelector('.exp-description').value;
      if (title && company) {
        experiences.push({ title, company, dates, description });
      }
    });
    updatePreview();
  }
  
  // Projects functionality
  addProjectBtn.addEventListener('click', addProject);
  
  function addProject() {
    projectCount++;
    const projDiv = document.createElement('div');
    projDiv.className = 'dynamic-section';
    projDiv.id = `project-${projectCount}`;
    projDiv.innerHTML = `
      <div class="dynamic-section-header">
        <h4>Project #${projectCount}</h4>
        <button class="remove-btn" onclick="removeProject(${projectCount})">Remove</button>
      </div>
      <div class="form-group">
        <label>Project Name *</label>
        <input type="text" class="proj-name" placeholder="Project Name">
      </div>
      <div class="form-group">
        <label>Description *</label>
        <textarea class="proj-description" placeholder="Describe the project..."></textarea>
      </div>
    `;
    projectsContainer.appendChild(projDiv);
    
    // Add event listeners to new inputs
    projDiv.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', updateProjectData);
    });
  }
  
  window.removeProject = function(id) {
    const projDiv = document.getElementById(`project-${id}`);
    if (projDiv) {
      projDiv.remove();
      updateProjectData();
    }
  };
  
  function updateProjectData() {
    projects = [];
    document.querySelectorAll('#projectsContainer .dynamic-section').forEach(projDiv => {
      const name = projDiv.querySelector('.proj-name').value;
      const description = projDiv.querySelector('.proj-description').value;
      if (name) {
        projects.push({ name, description });
      }
    });
    updatePreview();
  }
  
  // Clear all data
  clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all data?')) {
      fullName.value = '';
      jobTitle.value = '';
      email.value = '';
      phone.value = '';
      address.value = '';
      summary.value = '';
      skills = [];
      educations = [];
      experiences = [];
      projects = [];
      skillsContainer.innerHTML = '';
      educationContainer.innerHTML = '';
      experienceContainer.innerHTML = '';
      projectsContainer.innerHTML = '';
      educationCount = 0;
      experienceCount = 0;
      projectCount = 0;
      updatePreview();
    }
  });
  
  // Template switching
  templateBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      templateBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const template = this.dataset.template;
      resumePreview.classList.remove('template-modern', 'template-minimal');
      resumePreview.classList.add(`template-${template}`);
    });
  });
  
  // PDF Download — window.print with dynamic container
  downloadPdfBtn.addEventListener('click', function() {
    // Always rebuild resume data fresh
    updatePreview();

    // Remove old container if exists
    var old = document.getElementById('print-container');
    if (old) old.remove();

    // Copy resume HTML into a new div DIRECTLY on body (outside modal)
    var pc = document.createElement('div');
    pc.id = 'print-container';
    pc.className = resumePreview.className;
    pc.innerHTML = resumePreview.innerHTML;

    // Force it fully visible and positioned for print
    pc.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:auto;' +
      'background:#fff;padding:32px;z-index:999999;' +
      'display:block;visibility:visible;opacity:1;';

    document.body.appendChild(pc);

    // Also force all children visible via a style tag
    var s = document.createElement('style');
    s.id = 'print-force-style';
    s.textContent = '@media print {' +
      'body > * { display: none !important; }' +
      'body > #print-container { display: block !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; background: #fff !important; padding: 32px !important; z-index: 999999 !important; }' +
      'body > #print-container * { display: revert !important; visibility: visible !important; opacity: 1 !important; }' +
      'body > #print-container span { display: inline-block !important; }' +
      '}';
    document.head.appendChild(s);

    // Wait for DOM to paint, then print
    setTimeout(function() {
      window.print();
      // Cleanup after print dialog closes
      setTimeout(function() {
        pc.remove();
        s.remove();
      }, 2000);
    }, 500);
  });
  
  // Preview Resume button
  if (previewResumeBtn) {
    previewResumeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      updatePreview();
      previewModal.classList.add('active');
    });
  }
  
  // Close modal
  closeModal.addEventListener('click', function() {
    previewModal.classList.remove('active');
  });
  
  // Edit Resume button
  editResumeBtn.addEventListener('click', function() {
    previewModal.classList.remove('active');
  });
  
  // Close modal on outside click
  previewModal.addEventListener('click', function(e) {
    if (e.target === previewModal) {
      previewModal.classList.remove('active');
    }
  });
  
  // Initialize with one education and experience entry
  addEducation();
  addExperience();
});
/**
 * ToolMatic - High Performance Client-Side Image Converter
 * Converts between JPG, PNG, WebP, and AVIF in batch mode.
 * 100% Client-Side. Images never leave the user's browser.
 */

(function () {
  'use strict';

  const state = {
    files: [], // Array of { id, file, originalName, originalSize, originalWidth, originalHeight, originalType, convertedBlob, convertedSize, targetMime, status, error, previewUrl }
    targetFormat: 'image/webp', // 'image/webp' | 'image/jpeg' | 'image/png' | 'image/avif'
    quality: 0.85,
    isProcessing: false,
    lang: document.documentElement.lang === 'id' ? 'id' : 'en'
  };

  const i18n = {
    en: {
      converting: 'Converting images...',
      convertingItem: 'Converting {current} of {total}...',
      original: 'Original',
      converted: 'Converted',
      download: 'Download',
      downloadAll: 'Download All as ZIP',
      clearAll: 'Clear All',
      heicError: 'HEIC is not supported in this browser. Please use JPG, PNG, or WebP.',
      errorProcessing: 'Failed to convert image.',
      zipCreating: 'Creating ZIP file...',
      zipSuccess: 'ZIP downloaded!'
    },
    id: {
      converting: 'Sedang mengonversi gambar...',
      convertingItem: 'Mengonversi {current} dari {total}...',
      original: 'Asli',
      converted: 'Hasil Konversi',
      download: 'Unduh',
      downloadAll: 'Unduh Semua sebagai ZIP',
      clearAll: 'Hapus Semua',
      heicError: 'HEIC tidak didukung di browser ini. Silakan gunakan JPG, PNG, atau WebP.',
      errorProcessing: 'Gagal mengonversi gambar.',
      zipCreating: 'Membuat file ZIP...',
      zipSuccess: 'ZIP berhasil diunduh!'
    }
  };

  const t = (key) => i18n[state.lang][key] || i18n.en[key] || key;

  // DOM Elements
  let dropZone, fileInput, targetFormatSelect, formatPills, qualitySlider, qualityValue,
    batchSummary, batchList, progressBar, progressFill, progressText,
    downloadAllBtn, clearAllBtn;

  document.addEventListener('DOMContentLoaded', initConverter);

  function initConverter() {
    dropZone = document.getElementById('converterDropZone');
    if (!dropZone) return; // Not an image converter page

    fileInput = document.getElementById('converterFileInput');
    targetFormatSelect = document.getElementById('targetFormatSelect');
    formatPills = document.querySelectorAll('.format-pill');
    qualitySlider = document.getElementById('converterQualitySlider');
    qualityValue = document.getElementById('converterQualityValue');
    batchSummary = document.getElementById('converterBatchSummary');
    batchList = document.getElementById('converterBatchList');
    progressBar = document.getElementById('converterProgress');
    progressFill = document.getElementById('converterProgressFill');
    progressText = document.getElementById('converterProgressText');
    downloadAllBtn = document.getElementById('converterDownloadAllBtn');
    clearAllBtn = document.getElementById('converterClearAllBtn');

    bindEvents();
  }

  function bindEvents() {
    // Dropzone Click
    dropZone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        fileInput.click();
      }
    });

    const triggerBtn = document.getElementById('converterUploadTrigger');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => fileInput.click());
    }

    // File Input Change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(Array.from(e.target.files));
        fileInput.value = '';
      }
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-active');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        handleFiles(Array.from(dt.files));
      }
    });

    // Clipboard Paste
    document.addEventListener('paste', (e) => {
      const items = e.clipboardData ? e.clipboardData.items : [];
      const imageFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        handleFiles(imageFiles);
      }
    });

    // Target Format Selection via Pills
    if (formatPills && formatPills.length > 0) {
      formatPills.forEach(pill => {
        pill.addEventListener('click', () => {
          formatPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          state.targetFormat = pill.getAttribute('data-format');
          if (targetFormatSelect) targetFormatSelect.value = state.targetFormat;
          toggleQualityVisibility();
          reprocessAll();
        });
      });
    }

    if (targetFormatSelect) {
      targetFormatSelect.addEventListener('change', () => {
        state.targetFormat = targetFormatSelect.value;
        if (formatPills) {
          formatPills.forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-format') === state.targetFormat);
          });
        }
        toggleQualityVisibility();
        reprocessAll();
      });
    }

    // Quality Slider
    if (qualitySlider) {
      qualitySlider.addEventListener('input', () => {
        const val = parseInt(qualitySlider.value, 10);
        state.quality = val / 100;
        if (qualityValue) qualityValue.textContent = val + '%';
      });
      qualitySlider.addEventListener('change', () => {
        reprocessAll();
      });
    }

    // Download All as ZIP
    if (downloadAllBtn) {
      downloadAllBtn.addEventListener('click', downloadAllAsZip);
    }

    // Clear All
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAll);
    }
  }

  function toggleQualityVisibility() {
    const qualityGroup = document.getElementById('converterQualityGroup');
    if (qualityGroup) {
      // PNG does not use lossy quality
      qualityGroup.style.display = state.targetFormat === 'image/png' ? 'none' : 'flex';
    }
  }

  async function handleFiles(newFiles) {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/') || f.name.match(/\.(jpe?g|png|webp|avif|heic|heif|bmp|gif)$/i));
    if (validFiles.length === 0) return;

    for (let f of validFiles) {
      const item = {
        id: 'conv_' + Math.random().toString(36).substring(2, 9),
        file: f,
        originalName: f.name,
        originalSize: f.size,
        originalWidth: 0,
        originalHeight: 0,
        originalType: f.type || guessMimeType(f.name),
        convertedBlob: null,
        convertedSize: 0,
        targetMime: state.targetFormat,
        status: 'pending',
        error: null,
        previewUrl: null
      };
      state.files.push(item);
    }

    renderBatchUI();
    processQueue();
  }

  function guessMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
      case 'avif': return 'image/avif';
      case 'heic':
      case 'heif': return 'image/heic';
      default: return 'image/jpeg';
    }
  }

  async function reprocessAll() {
    if (state.files.length === 0) return;
    state.files.forEach(item => {
      item.status = 'pending';
      item.convertedBlob = null;
      item.targetMime = state.targetFormat;
    });
    renderBatchUI();
    processQueue();
  }

  async function processQueue() {
    if (state.isProcessing) return;
    state.isProcessing = true;

    const total = state.files.length;
    if (progressBar) progressBar.style.display = 'block';

    for (let i = 0; i < state.files.length; i++) {
      const item = state.files[i];
      if (item.status === 'done') continue;

      item.status = 'processing';
      updateProgress(i + 1, total);
      updateItemUI(item);

      try {
        await convertSingleImage(item);
        item.status = 'done';
      } catch (err) {
        console.error('Error converting image:', err);
        item.status = 'error';
        item.error = err.message || t('errorProcessing');
      }

      updateItemUI(item);
      updateBatchSummary();
    }

    state.isProcessing = false;
    if (progressBar) {
      setTimeout(() => {
        progressBar.style.display = 'none';
      }, 500);
    }
  }

  function updateProgress(current, total) {
    if (progressFill && progressText) {
      const pct = Math.round((current / total) * 100);
      progressFill.style.width = pct + '%';
      progressText.textContent = t('convertingItem').replace('{current}', current).replace('{total}', total);
    }
  }

  async function convertSingleImage(item) {
    let sourceBlob = item.file;

    // Handle HEIC
    if (item.originalType === 'image/heic' || item.originalName.toLowerCase().endsWith('.heic')) {
      if (typeof window.heic2any === 'function') {
        try {
          const converted = await window.heic2any({
            blob: item.file,
            toType: 'image/jpeg',
            quality: 0.95
          });
          sourceBlob = Array.isArray(converted) ? converted[0] : converted;
        } catch (e) {
          throw new Error(t('heicError'));
        }
      } else {
        throw new Error(t('heicError'));
      }
    }

    const img = await loadImage(sourceBlob);
    item.originalWidth = img.naturalWidth || img.width;
    item.originalHeight = img.naturalHeight || img.height;

    if (!item.previewUrl) {
      item.previewUrl = URL.createObjectURL(sourceBlob);
    }

    const canvas = document.createElement('canvas');
    canvas.width = item.originalWidth;
    canvas.height = item.originalHeight;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // White background for JPEG if transparent
    if (state.targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve, reject) => {
      if (state.targetFormat === 'image/avif') {
        canvas.toBlob((b) => {
          if (b && b.type === 'image/avif') resolve(b);
          else {
            // Fallback to WebP
            canvas.toBlob((fb) => resolve(fb || reject(new Error('Canvas export failed'))), 'image/webp', state.quality);
          }
        }, 'image/avif', state.quality);
        return;
      }

      if (state.targetFormat === 'image/png') {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas export failed'));
        }, 'image/png');
        return;
      }

      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas export failed'));
      }, state.targetFormat, state.quality);
    });

    item.convertedBlob = blob;
    item.convertedSize = blob.size;
  }

  function loadImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to decode image'));
      };
      img.src = url;
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function renderBatchUI() {
    if (!batchList) return;
    if (state.files.length === 0) {
      batchList.innerHTML = '';
      if (batchSummary) batchSummary.style.display = 'none';
      return;
    }

    if (batchSummary) batchSummary.style.display = 'flex';
    batchList.innerHTML = '';

    state.files.forEach(item => {
      const card = document.createElement('div');
      card.id = item.id;
      card.className = 'image-card';
      card.innerHTML = buildItemHtml(item);
      bindItemEvents(card, item);
      batchList.appendChild(card);
    });

    updateBatchSummary();
  }

  function updateItemUI(item) {
    const card = document.getElementById(item.id);
    if (!card) return;
    card.innerHTML = buildItemHtml(item);
    bindItemEvents(card, item);
  }

  function buildItemHtml(item) {
    const isDone = item.status === 'done';
    const isError = item.status === 'error';
    const isProcessing = item.status === 'processing';

    const origFmt = (item.originalType || 'JPG').replace('image/', '').toUpperCase();
    const targetFmt = state.targetFormat.replace('image/', '').toUpperCase();

    let diffText = '';
    let diffClass = '';
    if (isDone && item.originalSize > 0) {
      const diff = item.originalSize - item.convertedSize;
      const pct = Math.round((Math.abs(diff) / item.originalSize) * 100);
      if (diff > 0) {
        diffText = `-${pct}%`;
        diffClass = 'stat-saved';
      } else if (diff < 0) {
        diffText = `+${pct}%`;
        diffClass = 'stat-increased';
      } else {
        diffText = '0%';
      }
    }

    return `
      <div class="card-thumb">
        <img src="${item.previewUrl || ''}" alt="${escapeHtml(item.originalName)}" loading="lazy">
      </div>
      <div class="card-details">
        <div class="card-title" title="${escapeHtml(item.originalName)}">${escapeHtml(item.originalName)}</div>
        <div class="card-meta">
          <span class="meta-tag meta-orig">${t('original')}: ${formatBytes(item.originalSize)} (${origFmt})</span>
          ${isDone ? `
            <span class="meta-arrow">→</span>
            <span class="meta-tag meta-comp">${t('converted')}: <strong>${formatBytes(item.convertedSize)}</strong></span>
            <span class="badge badge-format">${origFmt} → ${targetFmt}</span>
            ${diffText ? `<span class="badge ${diffClass}">${diffText}</span>` : ''}
          ` : ''}
          ${isProcessing ? `<span class="badge badge-processing">${t('converting')}</span>` : ''}
          ${isError ? `<span class="badge badge-error">${escapeHtml(item.error)}</span>` : ''}
        </div>
      </div>
      <div class="card-actions">
        ${isDone ? `
          <button class="btn btn-sm btn-primary btn-download-single" data-id="${item.id}" title="${t('download')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${t('download')}</span>
          </button>
        ` : ''}
        <button class="btn-icon btn-remove" data-id="${item.id}" title="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;
  }

  function bindItemEvents(card, item) {
    const downloadBtn = card.querySelector('.btn-download-single');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => downloadSingle(item));
    }

    const removeBtn = card.querySelector('.btn-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => removeItem(item.id));
    }
  }

  function removeItem(id) {
    const idx = state.files.findIndex(f => f.id === id);
    if (idx !== -1) {
      if (state.files[idx].previewUrl) URL.revokeObjectURL(state.files[idx].previewUrl);
      state.files.splice(idx, 1);
    }
    renderBatchUI();
  }

  function clearAll() {
    state.files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    state.files = [];
    renderBatchUI();
  }

  function triggerDownload(blob, filename) {
    if (!blob) {
      console.error('Cannot download: blob is empty');
      return;
    }

    // Clean filename: remove illegal filesystem characters
    const safeFilename = filename.replace(/[<>:"/\\|?*]/g, '_');

    // Legacy Edge/IE support
    if (window.navigator && typeof window.navigator.msSaveOrOpenBlob === 'function') {
      window.navigator.msSaveOrOpenBlob(blob, safeFilename);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFilename;
    link.setAttribute('download', safeFilename);
    link.setAttribute('target', '_self');
    link.rel = 'noopener';
    link.style.position = 'fixed';
    link.style.top = '-9999px';
    link.style.left = '-9999px';
    link.style.opacity = '0';

    document.body.appendChild(link);

    try {
      link.click();
    } catch (e) {
      const evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      link.dispatchEvent(evt);
    }

    // Retain Object URL for 60 seconds to ensure the browser finishes writing the file
    setTimeout(() => {
      try {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch (err) {}
    }, 60000);
  }

  function downloadSingle(item) {
    if (!item.convertedBlob) return;
    const actualMime = (item.convertedBlob && item.convertedBlob.type) ? item.convertedBlob.type : state.targetFormat;
    const ext = getExtensionForMime(actualMime);
    const dotIndex = item.originalName.lastIndexOf('.');
    const baseName = dotIndex > 0 ? item.originalName.substring(0, dotIndex) : item.originalName;
    const downloadName = `${baseName}.${ext}`;

    triggerDownload(item.convertedBlob, downloadName);
  }

  async function downloadAllAsZip() {
    const doneItems = state.files.filter(f => f.status === 'done' && f.convertedBlob);
    if (doneItems.length === 0) return;

    if (typeof JSZip === 'undefined') {
      alert('JSZip library loading... please wait a moment.');
      return;
    }

    const zipBtn = downloadAllBtn;
    const origText = zipBtn.innerHTML;
    zipBtn.innerHTML = `<span>${t('zipCreating')}</span>`;
    zipBtn.disabled = true;

    try {
      const zip = new JSZip();
      const usedNames = new Set();

      doneItems.forEach((item, index) => {
        const actualMime = (item.convertedBlob && item.convertedBlob.type) ? item.convertedBlob.type : state.targetFormat;
        const ext = getExtensionForMime(actualMime);
        const dotIndex = item.originalName.lastIndexOf('.');
        const baseName = dotIndex > 0 ? item.originalName.substring(0, dotIndex) : `image_${index + 1}`;
        let finalName = `${baseName}.${ext}`;

        let counter = 1;
        while (usedNames.has(finalName)) {
          finalName = `${baseName}-${counter}.${ext}`;
          counter++;
        }
        usedNames.add(finalName);

        zip.file(finalName, item.convertedBlob);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      triggerDownload(zipBlob, 'toolmatic-converted-images.zip');
    } catch (err) {
      console.error('ZIP error:', err);
      alert('Failed to generate ZIP archive: ' + (err.message || 'Unknown error'));
    } finally {
      zipBtn.innerHTML = origText;
      zipBtn.disabled = false;
    }
  }

  function updateBatchSummary() {
    if (!batchSummary) return;
    const doneItems = state.files.filter(f => f.status === 'done');
    if (doneItems.length === 0) {
      batchSummary.style.display = 'none';
      return;
    }

    batchSummary.style.display = 'flex';

    let totalOrig = 0;
    let totalConv = 0;
    doneItems.forEach(item => {
      totalOrig += item.originalSize;
      totalConv += item.convertedSize;
    });

    const countElem = document.getElementById('converterSummaryCount');
    const origElem = document.getElementById('converterSummaryOriginal');
    const convElem = document.getElementById('converterSummaryConverted');

    if (countElem) countElem.textContent = doneItems.length + ' ' + (state.lang === 'id' ? 'gambar' : 'images');
    if (origElem) origElem.textContent = formatBytes(totalOrig);
    if (convElem) convElem.textContent = formatBytes(totalConv);
  }

  function getExtensionForMime(mime) {
    if (!mime) return 'jpg';
    mime = mime.toLowerCase();
    if (mime.includes('png')) return 'png';
    if (mime.includes('webp')) return 'webp';
    if (mime.includes('avif')) return 'avif';
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
    return 'jpg';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();

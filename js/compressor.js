/**
 * ToolMatic - High Performance Client-Side Image Compressor & Converter
 * 100% Client-Side. Images never leave the user's browser.
 */

(function () {
  'use strict';

  // State
  const state = {
    files: [], // Array of { id, file, originalName, originalSize, originalWidth, originalHeight, originalType, compressedBlob, compressedSize, compressedWidth, compressedHeight, compressedType, status, error }
    mode: 'quality', // 'quality' | 'target'
    quality: 0.8,
    targetKb: 200,
    format: 'original', // 'original' | 'image/webp' | 'image/jpeg' | 'image/png' | 'image/avif'
    resizeMode: 'none', // 'none' | 'pct' | 'custom' | 'preset-whatsapp' | 'preset-ig-post' | 'preset-ig-story' | 'preset-fb' | 'preset-web'
    resizePct: 50,
    customWidth: null,
    customHeight: null,
    maintainAspectRatio: true,
    isProcessing: false,
    lang: document.documentElement.lang === 'id' ? 'id' : 'en'
  };

  const i18n = {
    en: {
      dropText: 'Drag & drop your images here',
      dropSubtext: 'or click to browse from your device (JPG, PNG, WebP, AVIF, HEIC - Up to 50 images)',
      processing: 'Compressing images...',
      processingItem: 'Compressing {current} of {total}...',
      saved: 'Saved',
      original: 'Original',
      compressed: 'Compressed',
      download: 'Download',
      downloadAll: 'Download All as ZIP',
      clearAll: 'Clear All',
      noImages: 'No images processed yet.',
      privacyNotice: 'Your images never leave your device — everything happens in your browser.',
      heicNotice: 'HEIC format is converting via browser helper...',
      heicError: 'HEIC is not supported in this browser. Please use JPG, PNG, or WebP.',
      errorProcessing: 'Failed to process image.',
      whatsappApplied: 'WhatsApp preset applied! (1600px max, target <200KB)',
      zipCreating: 'Creating ZIP file...',
      zipSuccess: 'ZIP downloaded!'
    },
    id: {
      dropText: 'Seret & letakkan gambar Anda di sini',
      dropSubtext: 'atau klik untuk memilih dari perangkat (JPG, PNG, WebP, AVIF, HEIC - Hingga 50 gambar)',
      processing: 'Sedang mengompres gambar...',
      processingItem: 'Mengompres {current} dari {total}...',
      saved: 'Hemat',
      original: 'Asli',
      compressed: 'Hasil Kompres',
      download: 'Unduh',
      downloadAll: 'Unduh Semua sebagai ZIP',
      clearAll: 'Hapus Semua',
      noImages: 'Belum ada gambar yang diproses.',
      privacyNotice: 'Gambar Anda tidak pernah meninggalkan perangkat — semua diproses di browser Anda.',
      heicNotice: 'Format HEIC sedang dikonversi di browser...',
      heicError: 'HEIC tidak didukung di browser ini. Silakan gunakan JPG, PNG, atau WebP.',
      errorProcessing: 'Gagal memproses gambar.',
      whatsappApplied: 'Preset WhatsApp diterapkan! (maks 1600px, target <200KB)',
      zipCreating: 'Membuat file ZIP...',
      zipSuccess: 'ZIP berhasil diunduh!'
    }
  };

  const t = (key) => i18n[state.lang][key] || i18n.en[key] || key;

  // DOM Elements
  let dropZone, fileInput, qualitySlider, qualityValue, modeQualityBtn, modeTargetBtn,
    targetSizeContainer, qualityContainer, targetSizeInput, formatSelect, resizeSelect,
    customResizeInputs, customWidthInput, customHeightInput, presetWhatsappBtn,
    batchSummary, batchList, progressBar, progressFill, progressText,
    downloadAllBtn, clearAllBtn;

  document.addEventListener('DOMContentLoaded', initCompressor);

  function initCompressor() {
    dropZone = document.getElementById('compressorDropZone');
    if (!dropZone) return; // Not an image compressor page

    fileInput = document.getElementById('compressorFileInput');
    qualitySlider = document.getElementById('qualitySlider');
    qualityValue = document.getElementById('qualityValue');
    modeQualityBtn = document.getElementById('modeQuality');
    modeTargetBtn = document.getElementById('modeTarget');
    targetSizeContainer = document.getElementById('targetSizeContainer');
    qualityContainer = document.getElementById('qualityContainer');
    targetSizeInput = document.getElementById('targetSizeInput');
    formatSelect = document.getElementById('formatSelect');
    resizeSelect = document.getElementById('resizeSelect');
    customResizeInputs = document.getElementById('customResizeInputs');
    customWidthInput = document.getElementById('customWidthInput');
    customHeightInput = document.getElementById('customHeightInput');
    presetWhatsappBtn = document.getElementById('presetWhatsappBtn');
    batchSummary = document.getElementById('batchSummary');
    batchList = document.getElementById('batchList');
    progressBar = document.getElementById('compressorProgress');
    progressFill = document.getElementById('compressorProgressFill');
    progressText = document.getElementById('compressorProgressText');
    downloadAllBtn = document.getElementById('downloadAllBtn');
    clearAllBtn = document.getElementById('clearAllBtn');

    bindEvents();
  }

  function bindEvents() {
    // Dropzone Click
    dropZone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        fileInput.click();
      }
    });

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

    // Mode Toggle (Quality vs Target Size)
    if (modeQualityBtn && modeTargetBtn) {
      modeQualityBtn.addEventListener('click', () => {
        state.mode = 'quality';
        modeQualityBtn.classList.add('active');
        modeTargetBtn.classList.remove('active');
        if (qualityContainer) qualityContainer.style.display = 'block';
        if (targetSizeContainer) targetSizeContainer.style.display = 'none';
        reprocessAll();
      });

      modeTargetBtn.addEventListener('click', () => {
        state.mode = 'target';
        modeTargetBtn.classList.add('active');
        modeQualityBtn.classList.remove('active');
        if (qualityContainer) qualityContainer.style.display = 'none';
        if (targetSizeContainer) targetSizeContainer.style.display = 'block';
        reprocessAll();
      });
    }

    // Target Size Chips (100KB, 200KB, 500KB)
    document.querySelectorAll('.target-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.target-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const size = parseInt(chip.getAttribute('data-size'), 10);
        if (size && targetSizeInput) {
          targetSizeInput.value = size;
          state.targetKb = size;
          reprocessAll();
        }
      });
    });

    if (targetSizeInput) {
      targetSizeInput.addEventListener('change', () => {
        const val = parseInt(targetSizeInput.value, 10);
        if (val && val > 5) {
          state.targetKb = val;
          reprocessAll();
        }
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

    // Format Selector
    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        state.format = formatSelect.value;
        reprocessAll();
      });
    }

    // Resize Selector
    if (resizeSelect) {
      resizeSelect.addEventListener('change', () => {
        state.resizeMode = resizeSelect.value;
        if (customResizeInputs) {
          customResizeInputs.style.display = state.resizeMode === 'custom' ? 'flex' : 'none';
        }
        reprocessAll();
      });
    }

    if (customWidthInput) {
      customWidthInput.addEventListener('change', () => {
        state.customWidth = parseInt(customWidthInput.value, 10) || null;
        reprocessAll();
      });
    }

    if (customHeightInput) {
      customHeightInput.addEventListener('change', () => {
        state.customHeight = parseInt(customHeightInput.value, 10) || null;
        reprocessAll();
      });
    }

    // One-Click Preset: Compress for WhatsApp
    if (presetWhatsappBtn) {
      presetWhatsappBtn.addEventListener('click', () => {
        applyWhatsappPreset();
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

  function applyWhatsappPreset() {
    state.mode = 'quality';
    state.quality = 0.78;
    state.resizeMode = 'preset-whatsapp';
    state.format = 'image/jpeg';

    if (modeQualityBtn && modeTargetBtn) {
      modeQualityBtn.classList.add('active');
      modeTargetBtn.classList.remove('active');
    }
    if (qualityContainer) qualityContainer.style.display = 'block';
    if (targetSizeContainer) targetSizeContainer.style.display = 'none';
    if (qualitySlider) qualitySlider.value = 78;
    if (qualityValue) qualityValue.textContent = '78%';
    if (resizeSelect) resizeSelect.value = 'preset-whatsapp';
    if (formatSelect) formatSelect.value = 'image/jpeg';
    if (customResizeInputs) customResizeInputs.style.display = 'none';

    // Show temporary toast/badge
    showToast(t('whatsappApplied'));
    reprocessAll();
  }

  function showToast(message) {
    let toast = document.getElementById('compressorToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'compressorToast';
      toast.className = 'compressor-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  async function handleFiles(newFiles) {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/') || f.name.match(/\.(jpe?g|png|webp|avif|heic|heif|bmp|gif)$/i));
    if (validFiles.length === 0) return;

    for (let f of validFiles) {
      const item = {
        id: 'img_' + Math.random().toString(36).substring(2, 9),
        file: f,
        originalName: f.name,
        originalSize: f.size,
        originalWidth: 0,
        originalHeight: 0,
        originalType: f.type || guessMimeType(f.name),
        compressedBlob: null,
        compressedSize: 0,
        compressedWidth: 0,
        compressedHeight: 0,
        compressedType: '',
        status: 'pending', // 'pending' | 'processing' | 'done' | 'error'
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
      item.compressedBlob = null;
    });
    renderBatchUI();
    processQueue();
  }

  async function processQueue() {
    if (state.isProcessing) return;
    state.isProcessing = true;

    const pending = state.files.filter(f => f.status === 'pending');
    const total = state.files.length;

    if (progressBar) progressBar.style.display = 'block';

    for (let i = 0; i < state.files.length; i++) {
      const item = state.files[i];
      if (item.status === 'done') continue;

      item.status = 'processing';
      updateProgress(i + 1, total);
      updateItemUI(item);

      try {
        await processSingleImage(item);
        item.status = 'done';
      } catch (err) {
        console.error('Error processing image:', err);
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
      progressText.textContent = t('processingItem').replace('{current}', current).replace('{total}', total);
    }
  }

  async function processSingleImage(item) {
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

    // Load Image
    const img = await loadImage(sourceBlob);
    item.originalWidth = img.naturalWidth || img.width;
    item.originalHeight = img.naturalHeight || img.height;

    if (!item.previewUrl) {
      item.previewUrl = URL.createObjectURL(sourceBlob);
    }

    // Calculate Target Dimensions
    const dims = calculateDimensions(item.originalWidth, item.originalHeight);
    item.compressedWidth = dims.width;
    item.compressedHeight = dims.height;

    // Determine target format
    let targetMime = state.format;
    if (targetMime === 'original') {
      targetMime = item.originalType;
      if (targetMime === 'image/heic' || !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(targetMime)) {
        targetMime = 'image/jpeg';
      }
    }

    // Perform Compression
    let resultBlob;
    if (state.mode === 'target') {
      resultBlob = await compressToTargetSize(img, dims.width, dims.height, targetMime, state.targetKb * 1024);
    } else {
      resultBlob = await renderToCanvasBlob(img, dims.width, dims.height, targetMime, state.quality);
    }

    item.compressedBlob = resultBlob;
    item.compressedSize = resultBlob.size;
    item.compressedType = targetMime;
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
        reject(new Error('Image decode failed'));
      };
      img.src = url;
    });
  }

  function calculateDimensions(origW, origH) {
    let w = origW;
    let h = origH;
    const aspect = origW / origH;

    switch (state.resizeMode) {
      case 'pct':
        const scale = Math.max(0.1, Math.min(1.0, state.resizePct / 100));
        w = Math.round(origW * scale);
        h = Math.round(origH * scale);
        break;

      case 'custom':
        if (state.customWidth && state.customHeight) {
          w = state.customWidth;
          h = state.customHeight;
        } else if (state.customWidth) {
          w = state.customWidth;
          h = Math.round(w / aspect);
        } else if (state.customHeight) {
          h = state.customHeight;
          w = Math.round(h * aspect);
        }
        break;

      case 'preset-whatsapp':
        // WhatsApp HD photo optimal: max dimension 1600px
        const maxWa = 1600;
        if (origW > maxWa || origH > maxWa) {
          if (origW >= origH) {
            w = maxWa;
            h = Math.round(maxWa / aspect);
          } else {
            h = maxWa;
            w = Math.round(maxWa * aspect);
          }
        }
        break;

      case 'preset-ig-post':
        // 1080 x 1080 square fit
        const maxIg = 1080;
        if (origW >= origH) {
          w = maxIg;
          h = Math.round(maxIg / aspect);
        } else {
          h = maxIg;
          w = Math.round(maxIg * aspect);
        }
        break;

      case 'preset-ig-story':
        // 1080 x 1920 (9:16)
        if (origW > 1080) {
          w = 1080;
          h = Math.round(1080 / aspect);
        }
        break;

      case 'preset-fb':
        // 1200 x 630
        if (origW > 1200) {
          w = 1200;
          h = Math.round(1200 / aspect);
        }
        break;

      case 'preset-web':
        // 1200px max width
        if (origW > 1200) {
          w = 1200;
          h = Math.round(1200 / aspect);
        }
        break;

      default:
        // 'none'
        w = origW;
        h = origH;
    }

    return { width: Math.max(1, w), height: Math.max(1, h) };
  }

  function renderToCanvasBlob(img, width, height, mimeType, quality) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // If PNG with transparency converting to JPEG, fill white background
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Check AVIF canvas support fallback
      if (mimeType === 'image/avif') {
        canvas.toBlob((blob) => {
          if (blob && blob.type === 'image/avif') {
            resolve(blob);
          } else {
            // Fallback to WebP
            canvas.toBlob((fallbackBlob) => {
              resolve(fallbackBlob || reject(new Error('Canvas export failed')));
            }, 'image/webp', quality);
          }
        }, 'image/avif', quality);
        return;
      }

      if (mimeType === 'image/png') {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas export failed'));
        }, 'image/png');
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed'));
      }, mimeType, quality);
    });
  }

  async function compressToTargetSize(img, width, height, mimeType, targetBytes) {
    // If target is larger than original uncompressed, just encode at high quality
    if (mimeType === 'image/png') {
      // PNG does not accept quality parameter in canvas.toBlob
      return renderToCanvasBlob(img, width, height, 'image/png', 1.0);
    }

    let minQ = 0.05;
    let maxQ = 0.95;
    let bestBlob = null;
    let currentW = width;
    let currentH = height;

    // Binary search quality parameter over 6 iterations
    for (let iter = 0; iter < 6; iter++) {
      const midQ = (minQ + maxQ) / 2;
      const blob = await renderToCanvasBlob(img, currentW, currentH, mimeType, midQ);

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        minQ = midQ; // Try to get higher quality still under target
      } else {
        maxQ = midQ; // File is too large, reduce quality
      }
    }

    // If even lowest quality exceeds target bytes, scale dimensions down
    let scaleIter = 0;
    while ((!bestBlob || bestBlob.size > targetBytes) && scaleIter < 4 && currentW > 300) {
      currentW = Math.round(currentW * 0.8);
      currentH = Math.round(currentH * 0.8);
      bestBlob = await renderToCanvasBlob(img, currentW, currentH, mimeType, 0.4);
      scaleIter++;
    }

    if (!bestBlob) {
      bestBlob = await renderToCanvasBlob(img, currentW, currentH, mimeType, 0.5);
    }

    return bestBlob;
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

    let savingsPct = 0;
    if (isDone && item.originalSize > 0) {
      savingsPct = Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100);
    }

    const formatBadge = item.compressedType ? item.compressedType.replace('image/', '').toUpperCase() : '';

    return `
      <div class="card-thumb">
        <img src="${item.previewUrl || ''}" alt="${escapeHtml(item.originalName)}" loading="lazy">
        ${isDone ? `<span class="badge badge-saved">-${savingsPct > 0 ? savingsPct : 0}%</span>` : ''}
      </div>
      <div class="card-details">
        <div class="card-title" title="${escapeHtml(item.originalName)}">${escapeHtml(item.originalName)}</div>
        <div class="card-meta">
          <span class="meta-tag meta-orig">${t('original')}: ${formatBytes(item.originalSize)} (${item.originalWidth}x${item.originalHeight})</span>
          ${isDone ? `
            <span class="meta-arrow">→</span>
            <span class="meta-tag meta-comp">${t('compressed')}: <strong>${formatBytes(item.compressedSize)}</strong> (${item.compressedWidth}x${item.compressedHeight})</span>
            <span class="badge badge-format">${formatBadge}</span>
          ` : ''}
          ${isProcessing ? `<span class="badge badge-processing">${t('processing')}</span>` : ''}
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
      downloadBtn.addEventListener('click', () => {
        downloadSingle(item);
      });
    }

    const removeBtn = card.querySelector('.btn-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        removeItem(item.id);
      });
    }
  }

  function removeItem(id) {
    const idx = state.files.findIndex(f => f.id === id);
    if (idx !== -1) {
      if (state.files[idx].previewUrl) {
        URL.revokeObjectURL(state.files[idx].previewUrl);
      }
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
    if (!item.compressedBlob) return;
    const actualMime = (item.compressedBlob && item.compressedBlob.type) ? item.compressedBlob.type : (item.compressedType || 'image/jpeg');
    const ext = getExtensionForMime(actualMime);
    const dotIndex = item.originalName.lastIndexOf('.');
    const baseName = dotIndex > 0 ? item.originalName.substring(0, dotIndex) : item.originalName;
    const downloadName = `${baseName}-min.${ext}`;

    triggerDownload(item.compressedBlob, downloadName);
  }

  async function downloadAllAsZip() {
    const doneItems = state.files.filter(f => f.status === 'done' && f.compressedBlob);
    if (doneItems.length === 0) return;

    if (typeof JSZip === 'undefined') {
      alert('JSZip library loading... please wait a moment or check internet connection.');
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
        const actualMime = (item.compressedBlob && item.compressedBlob.type) ? item.compressedBlob.type : (item.compressedType || 'image/jpeg');
        const ext = getExtensionForMime(actualMime);
        const dotIndex = item.originalName.lastIndexOf('.');
        const baseName = dotIndex > 0 ? item.originalName.substring(0, dotIndex) : `image_${index + 1}`;
        let finalName = `${baseName}-toolmatic.${ext}`;

        // Ensure unique names in zip
        let counter = 1;
        while (usedNames.has(finalName)) {
          finalName = `${baseName}-toolmatic-${counter}.${ext}`;
          counter++;
        }
        usedNames.add(finalName);

        zip.file(finalName, item.compressedBlob);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      triggerDownload(zipBlob, 'toolmatic-compressed-images.zip');
      showToast(t('zipSuccess'));
    } catch (err) {
      console.error('Error creating ZIP:', err);
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
    let totalComp = 0;
    doneItems.forEach(item => {
      totalOrig += item.originalSize;
      totalComp += item.compressedSize;
    });

    const totalSavedBytes = Math.max(0, totalOrig - totalComp);
    const overallPct = totalOrig > 0 ? Math.round((totalSavedBytes / totalOrig) * 100) : 0;

    const countElem = document.getElementById('summaryCount');
    const origElem = document.getElementById('summaryOriginal');
    const compElem = document.getElementById('summaryCompressed');
    const savedElem = document.getElementById('summarySaved');

    if (countElem) countElem.textContent = doneItems.length + ' ' + (state.lang === 'id' ? 'gambar' : 'images');
    if (origElem) origElem.textContent = formatBytes(totalOrig);
    if (compElem) compElem.textContent = formatBytes(totalComp);
    if (savedElem) savedElem.textContent = `-${overallPct}% (${formatBytes(totalSavedBytes)})`;
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

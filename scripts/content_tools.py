"""
Tools Content and Guides for ToolMatic (REVISED: ONLY 2 TOOLS)
Contains:
1. Image Compressor (Flagship)
2. Image Converter (Dedicated Tool)
100% Client-Side. Zero server uploads.
"""

def get_compressor_hero_ui(lang="en"):
    is_id = lang == "id"
    return f"""
    <div class="compressor-wrapper">
      <!-- Drop Zone -->
      <div class="dropzone" id="compressorDropZone">
        <input type="file" id="compressorFileInput" multiple accept="image/jpeg,image/png,image/webp,image/avif,.heic,.heif,image/bmp" style="display:none;">
        <div class="dropzone-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <div class="dropzone-heading">{'Seret & letakkan gambar Anda di sini' if is_id else 'Drag & drop your images here'}</div>
        <div class="dropzone-subtext">{'atau klik untuk memilih foto (Batch hingga 50 file: JPG, PNG, WebP, AVIF, HEIC)' if is_id else 'or click to browse from device (Batch mode up to 50 files: JPG, PNG, WebP, AVIF, HEIC)'}</div>
        
        <div class="dropzone-actions">
          <button type="button" class="btn btn-upload" id="compressorUploadTrigger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>{'Unggah Gambar' if is_id else 'Upload Images'}</span>
          </button>
        </div>

        <div class="privacy-banner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>{'Gambar Anda tidak pernah meninggalkan perangkat — semua diproses di browser Anda.' if is_id else 'Your images never leave your device — everything happens in your browser.'}</span>
        </div>
      </div>

      <!-- Settings Toolbar -->
      <div class="compressor-toolbar">
        <div class="toolbar-group">
          <div class="toolbar-label">{'Mode Kompres' if is_id else 'Compression Mode'}</div>
          <div class="mode-pills">
            <button type="button" class="mode-pill active" id="modeQuality">{'Kualitas' if is_id else 'Quality'}</button>
            <button type="button" class="mode-pill" id="modeTarget">{'Target Ukuran' if is_id else 'Target Size'}</button>
          </div>
        </div>

        <div class="toolbar-group" id="qualityContainer">
          <div class="toolbar-label">{'Kualitas' if is_id else 'Quality'}: <span id="qualityValue">80%</span></div>
          <div class="slider-wrap">
            <input type="range" id="qualitySlider" min="5" max="100" value="80" step="1">
          </div>
        </div>

        <div class="toolbar-group" id="targetSizeContainer" style="display:none;">
          <div class="toolbar-label">{'Target Ukuran File' if is_id else 'Target File Size'} (KB)</div>
          <div class="target-chips">
            <button type="button" class="target-chip" data-size="100">100 KB</button>
            <button type="button" class="target-chip active" data-size="200">200 KB</button>
            <button type="button" class="target-chip" data-size="500">500 KB</button>
            <input type="number" id="targetSizeInput" class="input-custom" value="200" min="10" max="5000" style="width: 76px; padding: 4px 6px;">
          </div>
        </div>

        <div class="toolbar-group">
          <div class="toolbar-label">{'Konversi Format' if is_id else 'Output Format'}</div>
          <select id="formatSelect" class="select-custom">
            <option value="original">{'Format Asli' if is_id else 'Keep Original'}</option>
            <option value="image/webp" selected>WebP ({'Rekomendasi Cepat' if is_id else 'Fastest & Smallest'})</option>
            <option value="image/jpeg">JPG / JPEG ({'Universal' if is_id else 'Universal'})</option>
            <option value="image/png">PNG ({'Transparan / Lossless' if is_id else 'Lossless Graphics'})</option>
            <option value="image/avif">AVIF ({'Next-Gen' if is_id else 'Next-Gen Modern'})</option>
          </select>
        </div>

        <div class="toolbar-group">
          <div class="toolbar-label">{'Ubah Ukuran (Resize)' if is_id else 'Resize Dimensions'}</div>
          <select id="resizeSelect" class="select-custom">
            <option value="none">{'Ukuran Asli' if is_id else 'Original Dimensions'}</option>
            <option value="preset-whatsapp">WhatsApp (1600px Max)</option>
            <option value="preset-ig-post">Instagram Post (1080x1080)</option>
            <option value="preset-ig-story">Instagram Story (1080x1920)</option>
            <option value="preset-fb">Facebook Post (1200x630)</option>
            <option value="preset-web">Website Hero (1200px Width)</option>
            <option value="pct">50% {'Persen' if is_id else 'Percent'}</option>
            <option value="custom">{'Kustom Px' if is_id else 'Custom Width/Height'}</option>
          </select>
        </div>
      </div>

      <!-- Custom Resize Inputs -->
      <div id="customResizeInputs" style="display:none; padding: 12px 20px; background: #F1F5F9; border-bottom: 1px solid var(--tool-border); gap: 12px; align-items: center; flex-wrap: wrap;">
        <span style="font-size:0.875rem; font-weight:600; color:#334155;">{'Dimensi Px:' if is_id else 'Custom Dimensions (px):'}</span>
        <input type="number" id="customWidthInput" class="input-custom" placeholder="Width (px)" style="width: 120px;">
        <span>×</span>
        <input type="number" id="customHeightInput" class="input-custom" placeholder="Height (px)" style="width: 120px;">
        <span style="font-size: 0.8rem; color:#64748B;">({'Aspek rasio dipertahankan otomatis' if is_id else 'Aspect ratio automatically preserved'})</span>
      </div>

      <!-- Live Progress Bar -->
      <div class="compressor-progress" id="compressorProgress">
        <div class="progress-track">
          <div class="progress-fill" id="compressorProgressFill"></div>
        </div>
        <div class="progress-text" id="compressorProgressText">{'Sedang memproses gambar...' if is_id else 'Processing images...'}</div>
      </div>

      <!-- Batch Summary Bar -->
      <div class="batch-summary" id="batchSummary">
        <div class="summary-stats">
          <span class="stat-item">{'Jumlah' if is_id else 'Total'}: <strong id="summaryCount">0</strong></span>
          <span class="stat-item">{'Asli' if is_id else 'Original'}: <strong id="summaryOriginal">0 MB</strong></span>
          <span class="stat-item">{'Hasil' if is_id else 'Compressed'}: <strong id="summaryCompressed">0 MB</strong></span>
          <span class="stat-saved" id="summarySaved">-0%</span>
        </div>
        <div class="summary-buttons">
          <button type="button" class="btn btn-zip" id="downloadAllBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>{'Unduh Semua sebagai ZIP' if is_id else 'Download All as ZIP'}</span>
          </button>
          <button type="button" class="btn btn-clear" id="clearAllBtn">{'Hapus Semua' if is_id else 'Clear All'}</button>
        </div>
      </div>

      <!-- Batch List Container -->
      <div class="batch-list" id="batchList"></div>
    </div>
    """

def get_converter_ui(lang="en"):
    is_id = lang == "id"
    return f"""
    <div class="compressor-wrapper">
      <!-- Drop Zone -->
      <div class="dropzone" id="converterDropZone">
        <input type="file" id="converterFileInput" multiple accept="image/jpeg,image/png,image/webp,image/avif,.heic,.heif,image/bmp" style="display:none;">
        <div class="dropzone-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
        </div>
        <div class="dropzone-heading">{'Seret & letakkan gambar yang ingin dikonversi' if is_id else 'Drag & drop images to convert'}</div>
        <div class="dropzone-subtext">{'Pilih hingga 50 file (Mendukung JPG, PNG, WebP, AVIF, HEIC)' if is_id else 'Select up to 50 files (Supports JPG, PNG, WebP, AVIF, HEIC)'}</div>
        
        <div class="dropzone-actions">
          <button type="button" class="btn btn-upload" id="converterUploadTrigger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>{'Unggah Gambar' if is_id else 'Upload Images'}</span>
          </button>
        </div>

        <div class="privacy-banner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>{'Gambar Anda tidak pernah meninggalkan perangkat — semua diproses di browser Anda.' if is_id else 'Your images never leave your device — everything happens in your browser.'}</span>
        </div>
      </div>

      <!-- Converter Settings Toolbar -->
      <div class="compressor-toolbar">
        <div class="toolbar-group">
          <div class="toolbar-label">{'Konversi ke Format Target' if is_id else 'Convert Target Format'}</div>
          <div class="mode-pills">
            <button type="button" class="mode-pill active format-pill" data-format="image/webp">WebP</button>
            <button type="button" class="mode-pill format-pill" data-format="image/jpeg">JPG</button>
            <button type="button" class="mode-pill format-pill" data-format="image/png">PNG</button>
            <button type="button" class="mode-pill format-pill" data-format="image/avif">AVIF</button>
          </div>
          <select id="targetFormatSelect" style="display:none;">
            <option value="image/webp" selected>WebP</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/avif">AVIF</option>
          </select>
        </div>

        <div class="toolbar-group" id="converterQualityGroup">
          <div class="toolbar-label">{'Kualitas Output' if is_id else 'Output Quality'}: <span id="converterQualityValue">85%</span></div>
          <div class="slider-wrap">
            <input type="range" id="converterQualitySlider" min="5" max="100" value="85" step="1">
          </div>
        </div>
      </div>

      <!-- Live Progress Bar -->
      <div class="compressor-progress" id="converterProgress">
        <div class="progress-track">
          <div class="progress-fill" id="converterProgressFill"></div>
        </div>
        <div class="progress-text" id="converterProgressText">{'Sedang mengonversi gambar...' if is_id else 'Converting images...'}</div>
      </div>

      <!-- Batch Summary Bar -->
      <div class="batch-summary" id="converterBatchSummary">
        <div class="summary-stats">
          <span class="stat-item">{'Jumlah' if is_id else 'Total'}: <strong id="converterSummaryCount">0</strong></span>
          <span class="stat-item">{'Asli' if is_id else 'Original'}: <strong id="converterSummaryOriginal">0 MB</strong></span>
          <span class="stat-item">{'Hasil' if is_id else 'Converted'}: <strong id="converterSummaryConverted">0 MB</strong></span>
        </div>
        <div class="summary-buttons">
          <button type="button" class="btn btn-zip" id="converterDownloadAllBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>{'Unduh Semua sebagai ZIP' if is_id else 'Download All as ZIP'}</span>
          </button>
          <button type="button" class="btn btn-clear" id="converterClearAllBtn">{'Hapus Semua' if is_id else 'Clear All'}</button>
        </div>
      </div>

      <!-- Batch List Container -->
      <div class="batch-list" id="converterBatchList"></div>
    </div>
    """

TOOLS_DATA = {
    "image-compressor": {
        "slug_en": "image-compressor",
        "slug_id": "kompres-gambar",
        "url_en": "/image-compressor/",
        "url_id": "/id/kompres-gambar/",
        "en": {
            "title": "Free Image Compressor - Compress JPG, PNG, WebP, AVIF Online",
            "desc": "Compress images online for free. 100% client-side privacy, batch upload up to 50 images, target KB size mode, and instant ZIP download.",
            "h1": "Free Online Image Compressor",
            "subtitle": "Compress JPG, PNG, WebP, and AVIF photos up to 90% without losing quality. 100% client-side — your photos never leave your device.",
            "guide_html": """
            <div class="in-short-box">
              <div class="in-short-title">In Short</div>
              <p class="in-short-text">ToolMatic's Image Compressor is a 100% client-side tool that reduces image file sizes by up to 90% using your browser's native Canvas API. Drag and drop up to 50 images at once, adjust quality, choose target file size (e.g. under 200 KB), resize dimensions, and download files individually or as a combined ZIP archive with zero server uploads.</p>
            </div>

            <h2>How to Compress Images Online Without Losing Quality</h2>
            <p>Image compression reduces file weight in bytes without sacrificing visible clarity. Camera photos from modern smartphones easily reach 5 MB to 15 MB, making them too heavy for websites, email attachments, and messaging apps. By removing imperceptible high-frequency color variations and unnecessary metadata, file sizes drop by 70% to 90% while keeping visual edges crisp.</p>

            <div class="steps-grid">
              <div class="step-card">
                <div class="step-num">1</div>
                <div class="step-title">Upload or Drag & Drop Images</div>
                <p class="step-desc">Select up to 50 photos in JPG, PNG, WebP, AVIF, or HEIC format. You can also paste images directly from your clipboard with Ctrl+V.</p>
              </div>
              <div class="step-card">
                <div class="step-num">2</div>
                <div class="step-title">Choose Quality or Target Size</div>
                <p class="step-desc">Keep the default 80% quality for optimal visual clarity, or pick "Target Size" mode to force files under 100 KB or 200 KB.</p>
              </div>
              <div class="step-card">
                <div class="step-num">3</div>
                <div class="step-title">Download Single or Batch ZIP</div>
                <p class="step-desc">Preview savings percentages and dimensions instantly. Download files individually or click "Download All as ZIP" to export your entire batch.</p>
              </div>
            </div>

            <h2>Image Format Comparison: Which Output Should You Pick?</h2>
            <div class="table-responsive">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Format</th>
                    <th>Best For</th>
                    <th>Transparency</th>
                    <th>Average Compression</th>
                    <th>Browser Support</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>WebP</strong></td>
                    <td>Websites, blog articles, social media</td>
                    <td>Yes (Alpha)</td>
                    <td>25%–35% smaller than JPG</td>
                    <td>98%+ (All modern browsers)</td>
                  </tr>
                  <tr>
                    <td><strong>JPEG / JPG</strong></td>
                    <td>Photographs, legacy systems, print</td>
                    <td>No</td>
                    <td>Standard baseline</td>
                    <td>100% Universal</td>
                  </tr>
                  <tr>
                    <td><strong>PNG</strong></td>
                    <td>Logos, screenshots, vector graphics</td>
                    <td>Yes (Full 8-bit / 24-bit)</td>
                    <td>Lossless (larger file size)</td>
                    <td>100% Universal</td>
                  </tr>
                  <tr>
                    <td><strong>AVIF</strong></td>
                    <td>Next-generation modern web apps</td>
                    <td>Yes (Alpha & HDR)</td>
                    <td>40%–50% smaller than JPG</td>
                    <td>93%+ (Chrome, Firefox, Safari)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tool-promo-box">
              <div class="tool-promo-content">
                <h3>Need to Convert Image Formats?</h3>
                <p>Easily convert JPG to WebP, PNG to JPG, or WebP to AVIF in batch mode with our standalone Image Converter.</p>
              </div>
              <a href="/image-converter/" class="btn btn-primary">Open Image Converter</a>
            </div>

            <div class="takeaway-box">
              <div class="takeaway-title">Key Takeaways for Optimal Compression</div>
              <ul class="takeaway-list">
                <li><strong>Recommended Setting:</strong> Convert to WebP at 80% quality for the best compromise between sharpness and lightweight bytes.</li>
                <li><strong>WhatsApp Optimal Size:</strong> Standard WhatsApp images look best when capped at 1600px width and compressed under 200 KB.</li>
                <li><strong>100% Privacy Guarantee:</strong> No image data ever leaves your computer or mobile phone. All processing occurs locally via browser hardware acceleration.</li>
              </ul>
            </div>
            """,
            "faqs": [
                {
                    "q": "How do I compress an image without losing quality?",
                    "a": "To compress an image without visible quality loss, set the compression quality slider to between 75% and 85%, or convert the file to modern WebP format. This eliminates imperceptible digital artifacts and metadata while preserving crisp edges, color depth, and sharpness."
                },
                {
                    "q": "Are my images uploaded to any remote server?",
                    "a": "No, your images are never uploaded to any server. ToolMatic uses 100% client-side HTML5 Canvas and WebAssembly algorithms running strictly inside your device's web browser. Your private photos remain completely on your computer or phone."
                },
                {
                    "q": "What is the best image format for websites in 2026?",
                    "a": "WebP is the recommended image format for websites in 2026. It provides 25% to 35% smaller file sizes than standard JPEG at identical perceived quality, supports transparent alpha backgrounds, and is natively supported by over 98% of all web browsers worldwide."
                },
                {
                    "q": "How does the 'Compress for WhatsApp' preset work?",
                    "a": "The WhatsApp preset automatically resizes your image to a maximum dimension of 1600 pixels (the standard HD photo resolution for WhatsApp) and compresses it to approximately 78% quality. This ensures your photos send instantly without heavy cellular data usage or blurry re-compression by messaging servers."
                },
                {
                    "q": "Can I compress multiple images at the same time?",
                    "a": "Yes, ToolMatic supports batch compression for up to 50 images at once. Simply drag and drop all your files together, and our multi-threaded queue will process them in seconds. You can then download all compressed images in a single organized ZIP archive."
                },
                {
                    "q": "How do I compress an image to under 100 KB or 200 KB?",
                    "a": "Select 'Target Size' mode in our settings toolbar, choose the 100 KB or 200 KB chip (or type any custom number), and ToolMatic will automatically perform binary-search quality adjustments and proportional scaling to guarantee your output file stays beneath that exact byte threshold."
                }
            ]
        },
        "id": {
            "title": "Kompres Gambar Online Gratis - WebP, JPG, PNG, AVIF (100% Aman)",
            "desc": "Kompres gambar online gratis tanpa kurangi kualitas. 100% aman di browser tanpa upload server, batch foto, preset WhatsApp, target KB, dan unduh ZIP.",
            "h1": "Kompres Gambar Online Gratis",
            "subtitle": "Kecilkan ukuran foto JPG, PNG, WebP, dan AVIF hingga 90% tanpa pecah. 100% di browser — gambar Anda tidak pernah keluar dari perangkat.",
            "guide_html": """
            <div class="in-short-box">
              <div class="in-short-title">Ringkasan</div>
              <p class="in-short-text">Alat Kompres Gambar ToolMatic bekerja 100% di browser perangkat Anda tanpa upload server. Anda dapat memperkecil ukuran foto hingga 90% secara instan, mengompres hingga 50 gambar sekaligus, menentukan target ukuran (misal di bawah 100 KB atau 200 KB), mengubah format ke WebP/JPG/PNG, serta mengunduh semua hasil dalam format ZIP.</p>
            </div>

            <h2>Cara Mengompres Gambar Tanpa Mengurangi Kualitas</h2>
            <p>Kompresi gambar adalah teknik mengurangi ukuran file tanpa membuat foto terlihat buram atau pecah. Foto langsung dari kamera smartphone saat ini sering kali berukuran 5 MB hingga 15 MB. Ukuran ini sangat lambat saat dikirim melalui pesan, menghabiskan memori perangkat, dan memperlambat website.</p>

            <div class="steps-grid">
              <div class="step-card">
                <div class="step-num">1</div>
                <div class="step-title">Seret & Letakkan atau Unggah Gambar</div>
                <p class="step-desc">Pilih hingga 50 file gambar berformat JPG, PNG, WebP, AVIF, atau HEIC dari perangkat Anda.</p>
              </div>
              <div class="step-card">
                <div class="step-num">2</div>
                <div class="step-title">Pilih Kualitas atau Target Ukuran</div>
                <p class="step-desc">Gunakan kualitas standar 80% atau pilih mode "Target Ukuran" jika membutuhkan file di bawah 100 KB atau 200 KB.</p>
              </div>
              <div class="step-card">
                <div class="step-num">3</div>
                <div class="step-title">Unduh Satuan atau Semua File ZIP</div>
                <p class="step-desc">Lihat persentase penghematan ukuran file secara langsung. Unduh satu per satu atau unduh semua sekaligus dalam satu paket ZIP.</p>
              </div>
            </div>

            <div class="tool-promo-box">
              <div class="tool-promo-content">
                <h3>Perlu Mengubah Format Gambar?</h3>
                <p>Konversikan JPG ke WebP, PNG ke JPG, atau WebP ke AVIF secara massal dengan alat Konversi Gambar kami.</p>
              </div>
              <a href="/id/konversi-gambar/" class="btn btn-primary">Buka Konversi Gambar</a>
            </div>

            <div class="takeaway-box">
              <div class="takeaway-title">Tips Praktis Kompresi Foto</div>
              <ul class="takeaway-list">
                <li><strong>Rekomendasi Terbaik:</strong> Ubah format ke WebP dengan kualitas 80% untuk hasil paling tajam namun sangat ringan.</li>
                <li><strong>Untuk WhatsApp:</strong> Resolusi maksimal 1600 piksel dengan ukuran file di bawah 200 KB adalah kombinasi sempurna agar foto tidak dikompres paksa oleh WhatsApp.</li>
                <li><strong>Jaminan Privasi 100%:</strong> Foto Anda tidak pernah dikirim ke internet atau server kami. Seluruh proses berlangsung di perangkat Anda.</li>
              </ul>
            </div>
            """,
            "faqs": [
                {
                    "q": "Bagaimana cara kompres gambar tanpa mengurangi kualitas?",
                    "a": "Untuk memperkecil ukuran foto tanpa terlihat pecah, atur slider kualitas pada kisaran 75% hingga 85% atau konversikan ke format WebP. Pengaturan ini menghapus data piksel yang tidak tertangkap oleh mata manusia sehingga foto tetap tajam namun ukurannya jauh lebih ringan."
                },
                {
                    "q": "Apakah foto saya aman dan tidak diunggah ke server?",
                    "a": "Ya, 100% aman. ToolMatic memproses seluruh gambar secara lokal di dalam browser Anda menggunakan teknologi HTML5 Canvas. Foto Anda tidak pernah diunggah, tidak disimpan di server, dan tidak bisa dilihat oleh orang lain."
                },
                {
                    "q": "Berapa ukuran foto terbaik untuk dikirim ke WhatsApp?",
                    "a": "Ukuran ideal foto untuk WhatsApp adalah dimensi maksimal 1600 piksel pada sisi terpanjang dan bobot file di bawah 200 KB hingga 300 KB. Dengan memilih preset 'WhatsApp', foto Anda akan otomatis dioptimalkan agar tidak buram."
                },
                {
                    "q": "Bisakah saya mengompres banyak foto sekaligus?",
                    "a": "Tentu saja. ToolMatic mendukung kompresi batch hingga 50 foto secara bersamaan. Cukup seret semua foto ke kotak unggah, dan setelah selesai Anda dapat mengunduh seluruh hasil kompresi dalam satu file ZIP."
                },
                {
                    "q": "Bagaimana cara mengecilkan foto menjadi di bawah 100 KB atau 200 KB?",
                    "a": "Pilih mode 'Target Ukuran' di panel pengaturan, lalu klik opsi 100 KB atau 200 KB (atau ketik angka yang Anda inginkan). Sistem kami secara otomatis menyesuaikan kualitas kompresi agar ukuran file tepat berada di bawah batas tersebut."
                }
            ]
        }
    },
    "image-converter": {
        "slug_en": "image-converter",
        "slug_id": "konversi-gambar",
        "url_en": "/image-converter/",
        "url_id": "/id/konversi-gambar/",
        "en": {
            "title": "Free Image Converter - Convert JPG, PNG, WebP, AVIF Online",
            "desc": "Convert images between JPG, PNG, WebP, and AVIF online for free. 100% client-side, batch conversion up to 50 files, and instant ZIP download.",
            "h1": "Free Online Image Converter",
            "subtitle": "Convert between JPG, PNG, WebP, and AVIF formats in batch mode. 100% client-side — your images never leave your browser.",
            "guide_html": """
            <div class="in-short-box">
              <div class="in-short-title">In Short</div>
              <p class="in-short-text">ToolMatic's Image Converter is a 100% client-side format conversion utility that transforms JPG, PNG, WebP, AVIF, and HEIC files into modern web-optimized extensions directly in your browser. Batch convert up to 50 images at once, adjust lossy quality, and download individual files or a unified ZIP archive with zero cloud uploads.</p>
            </div>

            <h2>How to Convert Image Formats Online for Free</h2>
            <p>Different image formats serve distinct purposes on the web. Converting graphics to modern extensions like WebP or AVIF reduces page weight by up to 35% compared to legacy JPEG, while converting complex diagrams to PNG ensures lossless sharpness and transparency.</p>

            <div class="steps-grid">
              <div class="step-card">
                <div class="step-num">1</div>
                <div class="step-title">Upload Images in Batch</div>
                <p class="step-desc">Drag and drop up to 50 images into the converter box. Supports JPG, PNG, WebP, AVIF, and HEIC files.</p>
              </div>
              <div class="step-card">
                <div class="step-num">2</div>
                <div class="step-title">Select Target Format</div>
                <p class="step-desc">Choose WebP for fast website performance, JPG for universal compatibility, PNG for transparency, or AVIF for next-gen compression.</p>
              </div>
              <div class="step-card">
                <div class="step-num">3</div>
                <div class="step-title">Download Single or All as ZIP</div>
                <p class="step-desc">Inspect before/after file sizes and download your converted graphics instantly without waiting for cloud queues.</p>
              </div>
            </div>

            <h2>Format Guide: When to Convert to Each Format</h2>
            <div class="table-responsive">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Target Format</th>
                    <th>Ideal Use Case</th>
                    <th>Transparency Support</th>
                    <th>Key Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>WebP</strong></td>
                    <td>Websites, blog articles, social media</td>
                    <td>Yes (Alpha)</td>
                    <td>25%–35% smaller than JPG; supported by 98%+ of browsers.</td>
                  </tr>
                  <tr>
                    <td><strong>JPEG / JPG</strong></td>
                    <td>Printing, legacy software, photo archives</td>
                    <td>No</td>
                    <td>100% universal hardware and software compatibility.</td>
                  </tr>
                  <tr>
                    <td><strong>PNG</strong></td>
                    <td>Logos, UI icons, graphic mockups</td>
                    <td>Yes (Lossless)</td>
                    <td>Pixel-perfect sharpness without compression artifacts.</td>
                  </tr>
                  <tr>
                    <td><strong>AVIF</strong></td>
                    <td>Modern high-traffic web applications</td>
                    <td>Yes (Alpha & HDR)</td>
                    <td>Highest compression ratio; up to 50% lighter than JPG.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tool-promo-box">
              <div class="tool-promo-content">
                <h3>Looking to Compress File Sizes?</h3>
                <p>Reduce image sizes by up to 90% with target size controls and resize presets using our Image Compressor.</p>
              </div>
              <a href="/image-compressor/" class="btn btn-primary">Open Image Compressor</a>
            </div>

            <div class="takeaway-box">
              <div class="takeaway-title">Key Conversion Tips</div>
              <ul class="takeaway-list">
                <li>Converting photographic PNGs to WebP or JPG reduces file size by 70% to 85% with zero noticeable quality change.</li>
                <li>When converting transparent PNGs to JPG, transparent areas are automatically filled with clean white backgrounds.</li>
                <li>All conversion runs locally on your machine via HTML5 Canvas — your private files are never stored or seen by anyone.</li>
              </ul>
            </div>
            """,
            "faqs": [
                {
                    "q": "How do I convert JPG images to WebP online?",
                    "a": "To convert JPG to WebP, drag and drop your JPG files into ToolMatic's Image Converter, click the 'WebP' format pill, and download your converted files individually or as a complete ZIP archive. The conversion completes in milliseconds directly in your browser."
                },
                {
                    "q": "What happens to transparent backgrounds when converting PNG to JPG?",
                    "a": "Because the JPEG standard does not support alpha transparency channels, any transparent pixels in your source PNG image will be automatically filled with a solid white background during conversion."
                },
                {
                    "q": "Can I convert multiple images at the same time?",
                    "a": "Yes. ToolMatic supports batch conversion for up to 50 images simultaneously. All selected files are converted in parallel and can be downloaded together in a single ZIP file."
                },
                {
                    "q": "Are my files uploaded to a remote server during conversion?",
                    "a": "No. All format decoding and encoding execute 100% locally on your computer or phone using the browser's Canvas API. No image data is ever uploaded to any external server."
                },
                {
                    "q": "Which format should I convert my website images to?",
                    "a": "Convert your website images to WebP. WebP offers 25% to 35% smaller file sizes than standard JPEG at identical perceived quality, supports transparent backgrounds, and is natively supported by over 98% of web browsers."
                }
            ]
        },
        "id": {
            "title": "Konversi Gambar Online Gratis - Ubah Format JPG, PNG, WebP, AVIF",
            "desc": "Ubah format foto antara JPG, PNG, WebP, dan AVIF online gratis. 100% aman di browser tanpa upload server, batch hingga 50 file, dan unduh ZIP.",
            "h1": "Konversi Gambar Online Gratis",
            "subtitle": "Ubah format foto JPG, PNG, WebP, dan AVIF secara massal. 100% aman di browser — gambar tidak pernah keluar dari perangkat Anda.",
            "guide_html": """
            <div class="in-short-box">
              <div class="in-short-title">Ringkasan</div>
              <p class="in-short-text">Alat Konversi Gambar ToolMatic mengubah format foto antara JPG, PNG, WebP, AVIF, dan HEIC secara 100% lokal di browser Anda. Anda dapat mengonversi hingga 50 gambar sekaligus, mengatur kualitas kompresi, dan mengunduh semua hasil dalam format ZIP tanpa risiko kebocoran data.</p>
            </div>

            <h2>Cara Mengubah Format Gambar Online Gratis</h2>
            <p>Setiap format gambar memiliki kelebihan masing-masing. Mengubah foto lama ke format modern seperti WebP atau AVIF mampu memangkas bobot file hingga 35% lebih hemat kuota, sedangkan mengubah gambar ke format PNG memastikan detail logo dan latar transparan tetap terjaga sempurna.</p>

            <div class="steps-grid">
              <div class="step-card">
                <div class="step-num">1</div>
                <div class="step-title">Unggah Gambar Sekaligus</div>
                <p class="step-desc">Seret hingga 50 foto ke kotak konverter. Mendukung file JPG, PNG, WebP, AVIF, dan HEIC.</p>
              </div>
              <div class="step-card">
                <div class="step-num">2</div>
                <div class="step-title">Pilih Format Target</div>
                <p class="step-desc">Pilih WebP untuk kecepatan website, JPG untuk kecocokan umum, PNG untuk transparansi, atau AVIF untuk kompresi maksimal.</p>
              </div>
              <div class="step-card">
                <div class="step-num">3</div>
                <div class="step-title">Unduh Satuan atau Semua File ZIP</div>
                <p class="step-desc">Lihat perbandingan ukuran sebelum dan sesudah konversi, lalu unduh hasilnya secara instan tanpa perlu antre.</p>
              </div>
            </div>

            <div class="tool-promo-box">
              <div class="tool-promo-content">
                <h3>Ingin Memperkecil Ukuran Gambar?</h3>
                <p>Kurangi bobot foto hingga 90% dengan target ukuran tertentu dan preset resolusi menggunakan Kompres Gambar kami.</p>
              </div>
              <a href="/id/kompres-gambar/" class="btn btn-primary">Buka Kompres Gambar</a>
            </div>
            """,
            "faqs": [
                {
                    "q": "Bagaimana cara konversi foto JPG ke WebP?",
                    "a": "Cukup seret foto JPG Anda ke alat Konversi Gambar ToolMatic, pilih format target 'WebP', dan klik unduh. Seluruh proses selesai dalam hitungan detik langsung di browser Anda."
                },
                {
                    "q": "Apa yang terjadi pada latar transparan jika PNG diubah ke JPG?",
                    "a": "Karena format JPG tidak mendukung transparansi, bagian transparan pada foto PNG Anda akan otomatis diisi dengan warna latar putih bersih."
                },
                {
                    "q": "Apakah foto saya aman saat dikonversi?",
                    "a": "Ya, 100% aman. Seluruh proses konversi berjalan di prosesor perangkat lokal Anda (client-side) tanpa pernah dikirim ke server luar."
                }
            ]
        }
    }
}

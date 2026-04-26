// Plagiarism Checker Tool
document.addEventListener('DOMContentLoaded', function() {
  const textInput = document.getElementById('textInput');
  const checkBtn = document.getElementById('checkBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultsSection = document.getElementById('resultsSection');
  const uniquenessScore = document.getElementById('uniquenessScore');
  const uniquenessBar = document.getElementById('uniquenessBar');
  const uniquenessMessage = document.getElementById('uniquenessMessage');
  const warningsSection = document.getElementById('warningsSection');
  const highlightedSection = document.getElementById('highlightedSection');
  const highlightedText = document.getElementById('highlightedText');
  const repeatedPhrasesSection = document.getElementById('repeatedPhrasesSection');
  const repeatedPhrases = document.getElementById('repeatedPhrases');

  // Stats elements
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');
  const sentenceCount = document.getElementById('sentenceCount');
  const readingTime = document.getElementById('readingTime');

  // Common stop words to exclude from analysis
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'also', 'now', 'here', 'there', 'then', 'once', 'about', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further'
  ]);

  // Check Plagiarism
  checkBtn.addEventListener('click', function() {
    const text = textInput.value.trim();
    
    if (text.length < 50) {
      alert('Please enter at least 50 words for accurate plagiarism analysis.');
      return;
    }

    // Show results section
    resultsSection.style.display = 'block';

    // Calculate basic stats
    const stats = calculateStats(text);
    updateStats(stats);

    // Analyze plagiarism
    const analysis = analyzePlagiarism(text);
    
    // Update uniqueness score
    updateUniquenessScore(analysis.uniquenessScore);

    // Show warnings
    showWarnings(analysis.warnings);

    // Highlight duplicate content
    if (analysis.duplicateSentences.length > 0) {
      highlightedSection.style.display = 'block';
      highlightDuplicates(text, analysis.duplicateSentences);
    } else {
      highlightedSection.style.display = 'none';
    }

    // Show repeated phrases
    if (analysis.repeatedPhrases.length > 0) {
      repeatedPhrasesSection.style.display = 'block';
      showRepeatedPhrases(analysis.repeatedPhrases);
    } else {
      repeatedPhrasesSection.style.display = 'none';
    }

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear Text
  clearBtn.addEventListener('click', function() {
    textInput.value = '';
    resultsSection.style.display = 'none';
    highlightedSection.style.display = 'none';
    repeatedPhrasesSection.style.display = 'none';
  });

  // Calculate basic statistics
  function calculateStats(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const readingTimeMinutes = Math.ceil(words.length / 200);

    return {
      wordCount: words.length,
      charCount: characters,
      sentenceCount: sentences.length,
      readingTime: readingTimeMinutes
    };
  }

  // Update stats display
  function updateStats(stats) {
    wordCount.textContent = stats.wordCount.toLocaleString();
    charCount.textContent = stats.charCount.toLocaleString();
    sentenceCount.textContent = stats.sentenceCount.toLocaleString();
    readingTime.textContent = stats.readingTime + ' min';
  }

  // Analyze plagiarism
  function analyzePlagiarism(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const normalizedSentences = sentences.map(s => s.trim().toLowerCase().replace(/\s+/g, ' '));
    
    // Find duplicate sentences
    const duplicateSentences = [];
    const sentenceMap = new Map();
    
    normalizedSentences.forEach((sentence, index) => {
      if (sentenceMap.has(sentence)) {
        duplicateSentences.push({
          original: sentences[index],
          index: index,
          duplicateIndex: sentenceMap.get(sentence)
        });
      } else {
        sentenceMap.set(sentence, index);
      }
    });

    // Find repeated phrases (3+ words)
    const repeatedPhrases = findRepeatedPhrases(text);

    // Calculate uniqueness score
    let uniquenessScore = 100;
    
    // Penalize for duplicate sentences
    uniquenessScore -= (duplicateSentences.length * 5);
    
    // Penalize for repeated phrases
    uniquenessScore -= (repeatedPhrases.length * 2);
    
    // Penalize for low vocabulary diversity
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0 && !stopWords.has(w));
    const uniqueWords = new Set(words);
    const vocabularyDiversity = uniqueWords.size / words.length;
    
    if (vocabularyDiversity < 0.5) {
      uniquenessScore -= 10;
    } else if (vocabularyDiversity < 0.6) {
      uniquenessScore -= 5;
    }

    // Ensure score is between 0 and 100
    uniquenessScore = Math.max(0, Math.min(100, uniquenessScore));

    // Generate warnings
    const warnings = [];
    
    if (duplicateSentences.length > 0) {
      warnings.push({
        type: 'error',
        message: `${duplicateSentences.length} duplicate sentence(s) detected. Review and rephrase to improve originality.`
      });
    }
    
    if (repeatedPhrases.length > 3) {
      warnings.push({
        type: 'warning',
        message: `${repeatedPhrases.length} repeated phrase(s) found. Consider using synonyms to improve content variety.`
      });
    }
    
    if (vocabularyDiversity < 0.5) {
      warnings.push({
        type: 'warning',
        message: 'Low vocabulary diversity detected. Expand your word choice to improve content quality.'
      });
    }
    
    if (uniquenessScore >= 80) {
      warnings.push({
        type: 'success',
        message: 'Highly unique content! Your text shows good originality.'
      });
    } else if (uniquenessScore >= 60) {
      warnings.push({
        type: 'info',
        message: 'Content is moderately unique. Review highlighted sections for potential improvements.'
      });
    } else {
      warnings.push({
        type: 'error',
        message: 'Low uniqueness score detected. Significant revision recommended to improve originality.'
      });
    }

    return {
      uniquenessScore: Math.round(uniquenessScore),
      duplicateSentences,
      repeatedPhrases,
      warnings
    };
  }

  // Find repeated phrases (3+ words)
  function findRepeatedPhrases(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const phraseMap = new Map();
    const repeatedPhrases = [];

    // Check phrases of 3, 4, and 5 words
    for (let phraseLength = 3; phraseLength <= 5; phraseLength++) {
      for (let i = 0; i <= words.length - phraseLength; i++) {
        const phrase = words.slice(i, i + phraseLength).join(' ');
        
        if (phraseMap.has(phrase)) {
          phraseMap.set(phrase, phraseMap.get(phrase) + 1);
        } else {
          phraseMap.set(phrase, 1);
        }
      }
    }

    // Filter phrases that appear more than once
    phraseMap.forEach((count, phrase) => {
      if (count > 1) {
        repeatedPhrases.push({
          phrase: phrase,
          count: count
        });
      }
    });

    // Sort by frequency and return top 10
    return repeatedPhrases
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Update uniqueness score display
  function updateUniquenessScore(score) {
    uniquenessScore.textContent = score + '%';
    uniquenessBar.style.width = score + '%';
    
    // Set color based on score
    if (score >= 80) {
      uniquenessBar.style.background = '#16A34A';
      uniquenessScore.style.color = '#16A34A';
      uniquenessMessage.textContent = '✓ Highly unique content';
      uniquenessMessage.style.color = '#16A34A';
    } else if (score >= 60) {
      uniquenessBar.style.background = '#F59E0B';
      uniquenessScore.style.color = '#F59E0B';
      uniquenessMessage.textContent = '⚠ Moderately unique - review recommended';
      uniquenessMessage.style.color = '#F59E0B';
    } else {
      uniquenessBar.style.background = '#DC2626';
      uniquenessScore.style.color = '#DC2626';
      uniquenessMessage.textContent = '✗ Low uniqueness - revision needed';
      uniquenessMessage.style.color = '#DC2626';
    }
  }

  // Show warnings
  function showWarnings(warnings) {
    warningsSection.innerHTML = '';
    
    warnings.forEach(warning => {
      const warningDiv = document.createElement('div');
      warningDiv.style.padding = '12px 16px';
      warningDiv.style.marginBottom = '8px';
      warningDiv.style.borderRadius = '6px';
      warningDiv.style.borderLeft = '4px solid';
      
      if (warning.type === 'error') {
        warningDiv.style.backgroundColor = '#FEF2F2';
        warningDiv.style.borderColor = '#DC2626';
        warningDiv.style.color = '#991B1B';
      } else if (warning.type === 'warning') {
        warningDiv.style.backgroundColor = '#FFFBEB';
        warningDiv.style.borderColor = '#F59E0B';
        warningDiv.style.color = '#92400E';
      } else if (warning.type === 'success') {
        warningDiv.style.backgroundColor = '#F0FDF4';
        warningDiv.style.borderColor = '#16A34A';
        warningDiv.style.color = '#166534';
      } else {
        warningDiv.style.backgroundColor = '#EFF6FF';
        warningDiv.style.borderColor = '#2563EB';
        warningDiv.style.color = '#1E40AF';
      }
      
      warningDiv.textContent = warning.message;
      warningsSection.appendChild(warningDiv);
    });
  }

  // Highlight duplicate sentences
  function highlightDuplicates(text, duplicateSentences) {
    let highlightedHTML = text;
    
    // Sort by index in reverse order to maintain correct positions
    const sortedDuplicates = [...duplicateSentences].sort((a, b) => b.index - a.index);
    
    sortedDuplicates.forEach(dup => {
      const sentence = dup.original;
      const regex = new RegExp(escapeRegExp(sentence), 'gi');
      highlightedHTML = highlightedHTML.replace(regex, '<mark style="background-color: #FECACA; border: 1px solid #DC2626; padding: 2px 4px; border-radius: 3px;">$&</mark>');
    });
    
    highlightedText.innerHTML = highlightedHTML;
  }

  // Show repeated phrases
  function showRepeatedPhrases(phrases) {
    repeatedPhrases.innerHTML = '';
    
    phrases.forEach(item => {
      const phraseDiv = document.createElement('div');
      phraseDiv.style.padding = '8px 12px';
      phraseDiv.style.marginBottom = '8px';
      phraseDiv.style.backgroundColor = 'white';
      phraseDiv.style.border = '1px solid #E5E7EB';
      phraseDiv.style.borderRadius = '4px';
      phraseDiv.style.display = 'flex';
      phraseDiv.style.justifyContent = 'space-between';
      phraseDiv.style.alignItems = 'center';
      
      const phraseText = document.createElement('span');
      phraseText.textContent = `"${item.phrase}"`;
      phraseText.style.fontFamily = '"Courier New", monospace';
      phraseText.style.fontSize = '0.875rem';
      
      const countBadge = document.createElement('span');
      countBadge.textContent = `${item.count}x`;
      countBadge.style.padding = '4px 8px';
      countBadge.style.backgroundColor = '#F59E0B';
      countBadge.style.color = 'white';
      countBadge.style.borderRadius = '12px';
      countBadge.style.fontSize = '0.75rem';
      countBadge.style.fontWeight = '600';
      
      phraseDiv.appendChild(phraseText);
      phraseDiv.appendChild(countBadge);
      repeatedPhrases.appendChild(phraseDiv);
    });
  }

  // Escape special regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
});

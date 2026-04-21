// Word Counter Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const textInput = document.getElementById('textInput');
  const clearBtn = document.getElementById('clearBtn');
  const copyTextBtn = document.getElementById('copyTextBtn');
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');
  const charCountNoSpaces = document.getElementById('charCountNoSpaces');
  const sentenceCount = document.getElementById('sentenceCount');
  const paragraphCount = document.getElementById('paragraphCount');
  const readingTime = document.getElementById('readingTime');
  const speakingTime = document.getElementById('speakingTime');
  const uniqueWords = document.getElementById('uniqueWords');
  const mostFrequentWord = document.getElementById('mostFrequentWord');
  const avgWordLength = document.getElementById('avgWordLength');

  // Stop words to exclude from most frequent word calculation
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'in', 'on', 'at', 'to', 'of', 'for', 'with',
    'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
    'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours',
    'theirs', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
    'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could',
    'may', 'might', 'must', 'from', 'by', 'about', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just'
  ]);

  // Real-time analysis
  textInput.addEventListener('input', analyzeText);

  function analyzeText() {
    const text = textInput.value;
    
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;
    wordCount.textContent = totalWords;
    
    // Character count with spaces
    charCount.textContent = text.length;
    
    // Character count without spaces
    const textNoSpaces = text.replace(/\s/g, '');
    charCountNoSpaces.textContent = textNoSpaces.length;
    
    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    sentenceCount.textContent = sentences.length;
    
    // Paragraph count
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    paragraphCount.textContent = paragraphs.length;
    
    // Reading time (200 words per minute)
    const readingMinutes = Math.ceil(totalWords / 200);
    readingTime.textContent = readingMinutes > 0 ? `${readingMinutes} min` : '0 min';
    
    // Speaking time (130 words per minute)
    const speakingMinutes = Math.ceil(totalWords / 130);
    speakingTime.textContent = speakingMinutes > 0 ? `${speakingMinutes} min` : '0 min';
    
    // Unique words
    const lowerWords = words.map(w => w.toLowerCase());
    const uniqueWordSet = new Set(lowerWords);
    uniqueWords.textContent = uniqueWordSet.size;
    
    // Most frequent word (excluding stop words)
    const wordCounts = {};
    lowerWords.forEach(word => {
      if (!stopWords.has(word) && word.length > 1) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    
    let maxCount = 0;
    let mostFrequent = '-';
    for (const word in wordCounts) {
      if (wordCounts[word] > maxCount) {
        maxCount = wordCounts[word];
        mostFrequent = word;
      }
    }
    mostFrequentWord.textContent = mostFrequent;
    
    // Average word length
    if (totalWords > 0) {
      const totalChars = words.reduce((sum, word) => sum + word.length, 0);
      const avgLength = (totalChars / totalWords).toFixed(1);
      avgWordLength.textContent = avgLength;
    } else {
      avgWordLength.textContent = '0';
    }
  }

  // Clear text
  clearBtn.addEventListener('click', function() {
    textInput.value = '';
    analyzeText();
  });

  // Copy text
  copyTextBtn.addEventListener('click', function() {
    const text = textInput.value;
    if (!text) {
      return;
    }
    
    navigator.clipboard.writeText(text).then(function() {
      const originalText = copyTextBtn.textContent;
      copyTextBtn.textContent = 'Copied ✓';
      
      setTimeout(function() {
        copyTextBtn.textContent = originalText;
      }, 2000);
    }).catch(function(err) {
      console.error('Failed to copy: ', err);
    });
  });
});

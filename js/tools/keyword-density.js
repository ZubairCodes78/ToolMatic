// Keyword Density Checker Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const textContent = document.getElementById('textContent');
  const filterKeyword = document.getElementById('filterKeyword');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');
  const resultsArea = document.getElementById('resultsArea');
  const totalWords = document.getElementById('totalWords');
  const uniqueWords = document.getElementById('uniqueWords');
  const avgWordLength = document.getElementById('avgWordLength');
  const specificKeywordResult = document.getElementById('specificKeywordResult');
  const filterKeywordResult = document.getElementById('filterKeywordResult');
  const filterKeywordCount = document.getElementById('filterKeywordCount');
  const filterKeywordDensity = document.getElementById('filterKeywordDensity');
  const densityTableBody = document.getElementById('densityTableBody');
  const errorMessage = document.getElementById('errorMessage');

  // Stop words to exclude
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

  let analysisResults = null;

  // Analyze content
  analyzeBtn.addEventListener('click', function() {
    hideError('errorMessage');
    
    const text = textContent.value.trim();
    
    if (!text) {
      showError('errorMessage', 'Please enter some text to analyze.');
      return;
    }
    
    if (text.split(/\s+/).length < 10) {
      showError('errorMessage', 'Please enter at least 10 words for accurate analysis.');
      return;
    }

    // Process text
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0 && !stopWords.has(word));

    const totalWordCount = words.length;
    const uniqueWordSet = new Set(words);
    const uniqueWordCount = uniqueWordSet.size;
    
    // Calculate average word length
    const totalChars = words.reduce((sum, word) => sum + word.length, 0);
    const avgLength = totalWordCount > 0 ? (totalChars / totalWordCount).toFixed(2) : 0;

    // Count word frequencies
    const wordCounts = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Calculate density for each word
    const wordDensity = {};
    for (const word in wordCounts) {
      wordDensity[word] = ((wordCounts[word] / totalWordCount) * 100).toFixed(2);
    }

    // Sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    // Store results for export
    analysisResults = {
      totalWordCount,
      uniqueWordCount,
      avgLength,
      wordCounts,
      wordDensity,
      sortedWords
    };

    // Update UI
    totalWords.textContent = totalWordCount;
    uniqueWords.textContent = uniqueWordCount;
    avgWordLength.textContent = avgLength;

    // Check for specific keyword filter
    const filterValue = filterKeyword.value.trim().toLowerCase();
    if (filterValue) {
      const filterCount = wordCounts[filterValue] || 0;
      const filterDensity = wordDensity[filterValue] || 0;
      
      filterKeywordResult.textContent = filterValue;
      filterKeywordCount.textContent = filterCount;
      filterKeywordDensity.textContent = filterDensity;
      specificKeywordResult.style.display = 'block';
    } else {
      specificKeywordResult.style.display = 'none';
    }

    // Populate table
    densityTableBody.innerHTML = '';
    sortedWords.forEach(([word, count]) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${word}</td>
        <td>${count}</td>
        <td>${wordDensity[word]}%</td>
      `;
      densityTableBody.appendChild(row);
    });

    resultsArea.style.display = 'block';
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    textContent.value = '';
    filterKeyword.value = '';
    resultsArea.style.display = 'none';
    specificKeywordResult.style.display = 'none';
    hideError('errorMessage');
    analysisResults = null;
  });

  // Export CSV
  exportBtn.addEventListener('click', function() {
    if (!analysisResults) {
      showError('errorMessage', 'Please analyze content first before exporting.');
      return;
    }

    let csvContent = 'Keyword,Count,Density %\n';
    analysisResults.sortedWords.forEach(([word, count]) => {
      csvContent += `"${word}",${count},${analysisResults.wordDensity[word]}%\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-density-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

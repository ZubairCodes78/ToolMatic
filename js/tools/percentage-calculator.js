// Percentage Calculator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  // Tab 1: What is X% of Y
  const percent1 = document.getElementById('percent1');
  const number1 = document.getElementById('number1');
  const calculate1Btn = document.getElementById('calculate1Btn');
  const clear1Btn = document.getElementById('clear1Btn');
  const output1 = document.getElementById('output1');
  const result1 = document.getElementById('result1');
  
  // Tab 2: X is what % of Y
  const number2 = document.getElementById('number2');
  const total2 = document.getElementById('total2');
  const calculate2Btn = document.getElementById('calculate2Btn');
  const clear2Btn = document.getElementById('clear2Btn');
  const output2 = document.getElementById('output2');
  const result2 = document.getElementById('result2');
  
  // Tab 3: Percentage Change
  const original = document.getElementById('original');
  const newVal = document.getElementById('newVal');
  const calculate3Btn = document.getElementById('calculate3Btn');
  const clear3Btn = document.getElementById('clear3Btn');
  const output3 = document.getElementById('output3');
  const result3 = document.getElementById('result3');

  // Tab 1: What is X% of Y
  calculate1Btn.addEventListener('click', function() {
    const p = parseFloat(percent1.value);
    const n = parseFloat(number1.value);
    
    if (isNaN(p) || isNaN(n)) {
      alert('Please enter valid numbers for both fields.');
      return;
    }
    
    const result = (p / 100) * n;
    result1.innerHTML = `<strong>${p}% of ${n} = ${result.toFixed(2)}</strong>`;
    output1.style.display = 'block';
  });
  
  clear1Btn.addEventListener('click', function() {
    percent1.value = '';
    number1.value = '';
    output1.style.display = 'none';
  });
  
  // Tab 2: X is what % of Y
  calculate2Btn.addEventListener('click', function() {
    const x = parseFloat(number2.value);
    const y = parseFloat(total2.value);
    
    if (isNaN(x) || isNaN(y)) {
      alert('Please enter valid numbers for both fields.');
      return;
    }
    
    if (y === 0) {
      alert('Total cannot be zero.');
      return;
    }
    
    const result = (x / y) * 100;
    result2.innerHTML = `<strong>${x} is ${result.toFixed(2)}% of ${y}</strong>`;
    output2.style.display = 'block';
  });
  
  clear2Btn.addEventListener('click', function() {
    number2.value = '';
    total2.value = '';
    output2.style.display = 'none';
  });
  
  // Tab 3: Percentage Change
  calculate3Btn.addEventListener('click', function() {
    const orig = parseFloat(original.value);
    const newV = parseFloat(newVal.value);
    
    if (isNaN(orig) || isNaN(newV)) {
      alert('Please enter valid numbers for both fields.');
      return;
    }
    
    if (orig === 0) {
      alert('Original value cannot be zero.');
      return;
    }
    
    const change = ((newV - orig) / orig) * 100;
    const changeType = change >= 0 ? 'Increase' : 'Decrease';
    result3.innerHTML = `<strong>${Math.abs(change).toFixed(2)}% ${changeType}</strong><br><small>From ${orig} to ${newV}</small>`;
    output3.style.display = 'block';
  });
  
  clear3Btn.addEventListener('click', function() {
    original.value = '';
    newVal.value = '';
    output3.style.display = 'none';
  });
});

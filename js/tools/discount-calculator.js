// Discount Calculator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  // Tab 1: Calculate Discounted Price
  const originalPrice1 = document.getElementById('originalPrice1');
  const discountPercent = document.getElementById('discountPercent');
  const calculate1Btn = document.getElementById('calculate1Btn');
  const clear1Btn = document.getElementById('clear1Btn');
  const output1 = document.getElementById('output1');
  const discountAmount = document.getElementById('discountAmount');
  const finalPrice1 = document.getElementById('finalPrice1');
  const savings1 = document.getElementById('savings1');
  
  // Tab 2: Calculate Discount Percentage
  const originalPrice2 = document.getElementById('originalPrice2');
  const salePrice = document.getElementById('salePrice');
  const calculate2Btn = document.getElementById('calculate2Btn');
  const clear2Btn = document.getElementById('clear2Btn');
  const output2 = document.getElementById('output2');
  const discountPercentResult = document.getElementById('discountPercentResult');
  const discountAmount2 = document.getElementById('discountAmount2');
  const savings2 = document.getElementById('savings2');

  // Tab 1: Calculate Discounted Price
  calculate1Btn.addEventListener('click', function() {
    const original = parseFloat(originalPrice1.value);
    const discount = parseFloat(discountPercent.value);
    
    if (isNaN(original) || isNaN(discount)) {
      alert('Please enter valid numbers for both fields.');
      return;
    }
    
    if (original < 0 || discount < 0 || discount > 100) {
      alert('Please enter positive values. Discount percentage must be between 0 and 100.');
      return;
    }
    
    const discAmount = original * (discount / 100);
    const final = original - discAmount;
    
    discountAmount.textContent = discAmount.toFixed(2);
    finalPrice1.textContent = final.toFixed(2);
    savings1.textContent = discAmount.toFixed(2);
    
    output1.style.display = 'block';
  });
  
  clear1Btn.addEventListener('click', function() {
    originalPrice1.value = '';
    discountPercent.value = '';
    output1.style.display = 'none';
  });
  
  // Tab 2: Calculate Discount Percentage
  calculate2Btn.addEventListener('click', function() {
    const original = parseFloat(originalPrice2.value);
    const sale = parseFloat(salePrice.value);
    
    if (isNaN(original) || isNaN(sale)) {
      alert('Please enter valid numbers for both fields.');
      return;
    }
    
    if (original <= 0 || sale < 0) {
      alert('Please enter positive values. Original price must be greater than 0.');
      return;
    }
    
    if (sale > original) {
      alert('Sale price cannot be greater than original price.');
      return;
    }
    
    const discAmount = original - sale;
    const discPercent = (discAmount / original) * 100;
    
    discountPercentResult.textContent = discPercent.toFixed(2) + '%';
    discountAmount2.textContent = discAmount.toFixed(2);
    savings2.textContent = discAmount.toFixed(2);
    
    output2.style.display = 'block';
  });
  
  clear2Btn.addEventListener('click', function() {
    originalPrice2.value = '';
    salePrice.value = '';
    output2.style.display = 'none';
  });
});

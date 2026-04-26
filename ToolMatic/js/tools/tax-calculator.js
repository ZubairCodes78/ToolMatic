// Tax Calculator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const taxMode = document.getElementById('taxMode');
  const amount = document.getElementById('amount');
  const taxRate = document.getElementById('taxRate');
  const calculateBtn = document.getElementById('calculateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputArea = document.getElementById('outputArea');
  const taxAmount = document.getElementById('taxAmount');
  const totalAmount = document.getElementById('totalAmount');
  const originalAmount = document.getElementById('originalAmount');

  // Calculate tax
  calculateBtn.addEventListener('click', function() {
    const mode = taxMode.value;
    const amt = parseFloat(amount.value);
    const rate = parseFloat(taxRate.value);

    if (isNaN(amt) || isNaN(rate)) {
      alert('Please enter valid numbers for both fields.');
      return;
    }

    if (amt < 0 || rate < 0) {
      alert('Please enter positive values for both amount and tax rate.');
      return;
    }

    let tax, total, original;

    if (mode === 'add') {
      // Add tax mode
      tax = amt * (rate / 100);
      total = amt + tax;
      original = amt;
    } else {
      // Remove tax mode
      original = amt / (1 + rate / 100);
      tax = amt - original;
      total = amt;
    }

    taxAmount.textContent = tax.toFixed(2);
    totalAmount.textContent = total.toFixed(2);
    originalAmount.textContent = original.toFixed(2);

    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    amount.value = '';
    taxRate.value = '';
    outputArea.style.display = 'none';
  });
});

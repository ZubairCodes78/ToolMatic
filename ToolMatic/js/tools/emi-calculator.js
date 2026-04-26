// EMI Calculator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const loanAmount = document.getElementById('loanAmount');
  const interestRate = document.getElementById('interestRate');
  const loanTenure = document.getElementById('loanTenure');
  const calculateBtn = document.getElementById('calculateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputArea = document.getElementById('outputArea');
  const emiResult = document.getElementById('emiResult');
  const totalPayment = document.getElementById('totalPayment');
  const totalInterest = document.getElementById('totalInterest');
  const principalAmount = document.getElementById('principalAmount');
  const amortizationTable = document.getElementById('amortizationTable');

  // Calculate EMI
  calculateBtn.addEventListener('click', function() {
    const P = parseFloat(loanAmount.value);
    const annualRate = parseFloat(interestRate.value);
    const tenure = parseFloat(loanTenure.value);
    const tenureType = document.querySelector('input[name="tenureType"]:checked').value;

    if (isNaN(P) || isNaN(annualRate) || isNaN(tenure)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    if (P <= 0 || annualRate <= 0 || tenure <= 0) {
      alert('Please enter positive values for all fields.');
      return;
    }

    // Convert tenure to months
    const n = tenureType === 'years' ? tenure * 12 : tenure;

    // Monthly interest rate
    const r = annualRate / 12 / 100;

    // Calculate EMI
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Calculate total payment and interest
    const totalPay = emi * n;
    const totalInt = totalPay - P;

    // Display results
    emiResult.textContent = formatCurrency(emi);
    totalPayment.textContent = formatCurrency(totalPay);
    totalInterest.textContent = formatCurrency(totalInt);
    principalAmount.textContent = formatCurrency(P);

    // Generate amortization schedule (first 12 months)
    let balance = P;
    let tableHTML = '';
    
    for (let month = 1; month <= Math.min(n, 12); month++) {
      const interestPayment = balance * r;
      const principalPayment = emi - interestPayment;
      balance = balance - principalPayment;
      
      if (balance < 0) balance = 0;
      
      tableHTML += `
        <tr>
          <td>${month}</td>
          <td>${formatCurrency(principalPayment)}</td>
          <td>${formatCurrency(interestPayment)}</td>
          <td>${formatCurrency(balance)}</td>
        </tr>
      `;
    }

    // Add final row if more than 12 months
    if (n > 12) {
      tableHTML += `
        <tr>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
        </tr>
        <tr>
          <td>${n}</td>
          <td>${formatCurrency(P)}</td>
          <td>${formatCurrency(totalInt)}</td>
          <td>0</td>
        </tr>
      `;
    }

    amortizationTable.innerHTML = tableHTML;
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    loanAmount.value = '';
    interestRate.value = '';
    loanTenure.value = '';
    outputArea.style.display = 'none';
  });

  // Utility function to format currency
  function formatCurrency(amount) {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
});

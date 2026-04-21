// BMI Calculator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const unitRadios = document.querySelectorAll('input[name="unit"]');
  const metricInputs = document.getElementById('metricInputs');
  const imperialInputs = document.getElementById('imperialInputs');
  const weightKg = document.getElementById('weightKg');
  const heightCm = document.getElementById('heightCm');
  const weightLbs = document.getElementById('weightLbs');
  const heightFt = document.getElementById('heightFt');
  const heightIn = document.getElementById('heightIn');
  const calculateBtn = document.getElementById('calculateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputArea = document.getElementById('outputArea');
  const bmiResult = document.getElementById('bmiResult');
  const bmiCategory = document.getElementById('bmiCategory');
  const bmiMarker = document.getElementById('bmiMarker');
  const healthyRange = document.getElementById('healthyRange');
  const healthNote = document.getElementById('healthNote');

  // Unit toggle
  unitRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'metric') {
        metricInputs.style.display = 'block';
        imperialInputs.style.display = 'none';
      } else {
        metricInputs.style.display = 'none';
        imperialInputs.style.display = 'block';
      }
    });
  });

  // Calculate BMI
  calculateBtn.addEventListener('click', function() {
    const unit = document.querySelector('input[name="unit"]:checked').value;
    let weight, height;

    if (unit === 'metric') {
      weight = parseFloat(weightKg.value);
      height = parseFloat(heightCm.value) / 100; // Convert cm to meters
    } else {
      weight = parseFloat(weightLbs.value) * 0.453592; // Convert lbs to kg
      const ft = parseFloat(heightFt.value) || 0;
      const inches = parseFloat(heightIn.value) || 0;
      height = ((ft * 12) + inches) * 0.0254; // Convert to meters
    }

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      alert('Please enter valid positive numbers for weight and height.');
      return;
    }

    // Calculate BMI
    const bmi = weight / (height * height);
    const bmiRounded = bmi.toFixed(1);

    // Determine category
    let category, color, note;
    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#2563EB';
      note = 'Being underweight may indicate malnutrition or other health issues. Consult a healthcare provider to determine the cause and appropriate interventions.';
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = '#16A34A';
      note = 'Your BMI is within the healthy range. Maintain this weight through balanced nutrition and regular physical activity for optimal health.';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = '#F59E0B';
      note = 'Being overweight increases the risk of health problems. Consider lifestyle modifications including diet and exercise to reduce BMI and associated health risks.';
    } else {
      category = 'Obese';
      color = '#DC2626';
      note = 'Obesity significantly increases the risk of serious health problems. Medical intervention combined with lifestyle changes is often recommended. Consult a healthcare provider.';
    }

    // Calculate healthy weight range
    const minHealthyWeight = 18.5 * (height * height);
    const maxHealthyWeight = 24.9 * (height * height);
    
    let healthyWeightRange;
    if (unit === 'metric') {
      healthyWeightRange = `${minHealthyWeight.toFixed(1)} kg - ${maxHealthyWeight.toFixed(1)} kg`;
    } else {
      const minLbs = minHealthyWeight / 0.453592;
      const maxLbs = maxHealthyWeight / 0.453592;
      healthyWeightRange = `${minLbs.toFixed(1)} lbs - ${maxLbs.toFixed(1)} lbs`;
    }

    // Position marker on scale
    let markerPosition;
    if (bmi < 18.5) {
      markerPosition = (bmi / 18.5) * 18.5;
    } else if (bmi < 25) {
      markerPosition = 18.5 + ((bmi - 18.5) / 6.5) * 6.5;
    } else if (bmi < 30) {
      markerPosition = 25 + ((bmi - 25) / 5) * 5;
    } else {
      markerPosition = 30 + ((bmi - 30) / 20) * 20;
    }
    markerPosition = Math.min(Math.max(markerPosition, 0), 50);
    const markerPercent = (markerPosition / 50) * 100;

    // Display results
    bmiResult.textContent = bmiRounded;
    bmiResult.style.color = color;
    bmiCategory.textContent = category;
    bmiCategory.style.color = color;
    bmiMarker.style.left = `${markerPercent}%`;
    healthyRange.textContent = `For your height, the healthy weight range is: ${healthyWeightRange}`;
    healthNote.textContent = note;

    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    weightKg.value = '';
    heightCm.value = '';
    weightLbs.value = '';
    heightFt.value = '';
    heightIn.value = '';
    document.getElementById('age').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = false);
    outputArea.style.display = 'none';
  });
});

// Age Calculator Tool Logic

document.addEventListener('DOMContentLoaded', function() {
  const birthDate = document.getElementById('birthDate');
  const calculateDate = document.getElementById('calculateDate');
  const calculateBtn = document.getElementById('calculateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputArea = document.getElementById('outputArea');
  const ageResult = document.getElementById('ageResult');
  const totalDays = document.getElementById('totalDays');
  const totalWeeks = document.getElementById('totalWeeks');
  const dayOfWeek = document.getElementById('dayOfWeek');
  const nextBirthday = document.getElementById('nextBirthday');

  // Set default calculate date to today
  const today = new Date();
  calculateDate.value = formatDate(today);

  // Calculate age
  calculateBtn.addEventListener('click', function() {
    const birth = new Date(birthDate.value);
    const calcDate = new Date(calculateDate.value);

    if (isNaN(birth.getTime()) || isNaN(calcDate.getTime())) {
      alert('Please select valid dates.');
      return;
    }

    if (birth > calcDate) {
      alert('Date of birth cannot be after the calculation date.');
      return;
    }

    // Calculate age
    let years = calcDate.getFullYear() - birth.getFullYear();
    let months = calcDate.getMonth() - birth.getMonth();
    let days = calcDate.getDate() - birth.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(calcDate.getFullYear(), calcDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const totalDaysDiff = Math.floor((calcDate - birth) / (1000 * 60 * 60 * 24));
    const totalWeeksDiff = Math.floor(totalDaysDiff / 7);

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysOfWeek[birth.getDay()];

    // Next birthday
    const nextBirthYear = calcDate.getFullYear();
    let nextBirth = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
    nextBirth.setFullYear(nextBirthYear);
    
    if (nextBirth <= calcDate) {
      nextBirth.setFullYear(nextBirthYear + 1);
    }
    
    const daysToNext = Math.ceil((nextBirth - calcDate) / (1000 * 60 * 60 * 24));
    const nextBirthDay = daysOfWeek[nextBirth.getDay()];
    const nextBirthDate = nextBirth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Display results
    ageResult.textContent = `${years} years, ${months} months, ${days} days`;
    totalDays.textContent = totalDaysDiff.toLocaleString();
    totalWeeks.textContent = totalWeeksDiff.toLocaleString();
    dayOfWeek.textContent = bornDay;
    nextBirthday.textContent = `Your next birthday is in ${daysToNext} days (${nextBirthDate}, a ${nextBirthDay})`;

    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Clear form
  clearBtn.addEventListener('click', function() {
    birthDate.value = '';
    calculateDate.value = formatDate(new Date());
    outputArea.style.display = 'none';
  });

  // Utility function to format date
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});

// BMI Calculator Utility Functions
const activityLevels = [
  { value: 1.2, label: "Tidak Aktif (Aktivitas Minimal)" },
  { value: 1.375, label: "Sedikit Aktif (Olahraga 1-3kali/minggu)" },
  { value: 1.55, label: "Cukup Aktif (Olahraga 3-5kali/minggu)" },
  { value: 1.725, label: "Sangat Aktif (Olahraga 6-7kali/minggu)" },
  { value: 1.9, label: "Ekstra Aktif (Olahraga Berat, Pekerjaan Fisik)" }
];

// Calculate BMI
function calculateBMI(weight, height) {
  if (!weight || !height) return 0;
  return weight / ((height / 100) * (height / 100));
}

// Get BMI Category
function getBMICategory(bmi) {
  if (bmi < 18.5) return "Kekurangan Berat Badan";
  if (bmi < 25) return "Berat Badan Normal";
  if (bmi < 30) return "Kelebihan Berat Badan";
  return "Obesitas";
}

// Get BMI Color
function getBMIColor(bmi) {
  if (bmi < 18.5) return "#3498db"; // Blue for underweight
  if (bmi < 25) return "#2ecc71"; // Green for normal
  if (bmi < 30) return "#f39c12"; // Orange for overweight
  return "#e74c3c"; // Red for obese
}

// Calculate time to target BMI (in weeks)
function calculateTimeToTargetBMI(currentBMI, targetBMI, height, weeklyRateKg) {
  if (!currentBMI || !targetBMI || !height || !weeklyRateKg) return 0;
  
  const heightM = height / 100;
  const currentWeightKg = currentBMI * heightM * heightM;
  const targetWeightKg = targetBMI * heightM * heightM;
  const weightDifferenceKg = Math.abs(targetWeightKg - currentWeightKg);
  
  return weightDifferenceKg / Math.abs(weeklyRateKg);
}

// Calculate BMR (Basal Metabolic Rate)
function calculateBMR(weight, height, age, isMale) {
  if (!weight || !height || !age) return 0;
  
  if (isMale) {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr, activityLevel) {
  return bmr * activityLevel;
}

// Calculate Calorie Adjustment
function calculateCalorieAdjustment(weeklyWeightChangeKg) {
  // Approximately 7700 calories per kg of fat
  return weeklyWeightChangeKg * 7700 / 7;
}

// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });
  
  // Input elements
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const ageInput = document.getElementById('age');
  const genderInputs = document.getElementsByName('jenis_kelamin');
  const activitySelect = document.getElementById('preferensi_makanan'); // Activity level select
  
  // Target weight tab
  const targetWeightInput = document.getElementById('target_berat');
  const weightRateSlider = document.getElementById('laju');
  const weightRateDisplay = document.getElementById('nilaiLaju');
  const foodPreferenceSelect = document.getElementById('preferensi_makanan');
  
  // Target BMI tab
  const targetBMIInput = document.getElementById('target_imt');
  const bmiRateSlider = document.getElementById('laju_imt');
  const bmiRateDisplay = document.getElementById('nilaiLajuIMT');
  const foodPreferenceBMISelect = document.getElementById('preferensi_makanan_imt');
  
  // Result displays
  const currentBMIDisplay = document.querySelector('.current-imt');
  const currentBMIDesc = document.querySelector('.result-desc');
  const targetBMIDisplay = document.querySelector('.target-imt');
  const currentWeightDisplay = document.querySelector('.current-weight');
  const targetWeightDisplay = document.querySelector('.target-weight');
  const stateContainer = document.querySelector('.text-state');
  
  // Calculate buttons
  const calculateButtons = document.querySelectorAll('.button-calculate');
  
  // Weight change sliders
  weightRateSlider.addEventListener('input', function() {
    weightRateDisplay.textContent = this.value + ' kg';
    document.getElementById('slider-fill-weight').style.width = 
      ((this.value - this.min) / (this.max - this.min) * 100) + '%';
  });
  
  bmiRateSlider.addEventListener('input', function() {
    bmiRateDisplay.textContent = this.value + ' kg';
    document.getElementById('slider-fill-imt').style.width = 
      ((this.value - this.min) / (this.max - this.min) * 100) + '%';
  });
  
  // Update BMI when weight or height changes
  function updateCurrentBMI() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    
    if (weight && height) {
      const bmi = calculateBMI(weight, height);
      currentBMIDisplay.textContent = bmi.toFixed(1);
      currentBMIDesc.textContent = getBMICategory(bmi);
      currentWeightDisplay.textContent = weight.toFixed(1) + ' kg';
      
      // Change color based on BMI category
      currentBMIDisplay.style.color = getBMIColor(bmi);
    }
  }
  
  weightInput.addEventListener('input', updateCurrentBMI);
  heightInput.addEventListener('input', updateCurrentBMI);
  
  // Function to get current gender selection
  function getSelectedGender() {
    for (const radio of genderInputs) {
      if (radio.checked) {
        return radio.value === 'Pria';
      }
    }
    return true; // Default to male
  }
  
  // Function to get activity level multiplier
  function getActivityMultiplier() {
    const selectedIndex = activitySelect.selectedIndex;
    return activityLevels[selectedIndex].value;
  }
  
  // Calculate function
  function calculatePredictions() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const age = parseFloat(ageInput.value);
    const isMale = getSelectedGender();
    const activityLevel = getActivityMultiplier();
    
    // Check if inputs are valid
    if (!weight || !height || !age) {
      alert("Mohon lengkapi berat badan, tinggi badan, dan usia terlebih dahulu.");
      return;
    }
    
    // Calculate current BMI
    const currentBMI = calculateBMI(weight, height);
    
    // Determine which tab is active and get relevant values
    const isWeightTabActive = document.querySelector('[data-tab="berat"]').classList.contains('active');
    
    let targetWeight, targetBMI, weightChangeRate;
    
    if (isWeightTabActive) {
      targetWeight = parseFloat(targetWeightInput.value);
      if (!targetWeight) {
        alert("Mohon masukkan target berat badan.");
        return;
      }
      targetBMI = calculateBMI(targetWeight, height);
      weightChangeRate = parseFloat(weightRateSlider.value);
    } else {
      targetBMI = parseFloat(targetBMIInput.value);
      if (!targetBMI) {
        alert("Mohon masukkan target IMT.");
        return;
      }
      targetWeight = targetBMI * (height / 100) * (height / 100);
      weightChangeRate = parseFloat(bmiRateSlider.value);
    }
    
    // Update target displays
    targetBMIDisplay.textContent = targetBMI.toFixed(1);
    targetWeightDisplay.textContent = targetWeight.toFixed(1) + ' kg';
    
    // Determine if gaining or losing weight
    const isGaining = targetWeight > weight;
    const effectiveRate = isGaining ? weightChangeRate : -weightChangeRate;
    
    // Calculate time prediction
    const weeksPrediction = calculateTimeToTargetBMI(
      currentBMI,
      targetBMI,
      height,
      effectiveRate
    );
    
    // Calculate BMR and TDEE
    const bmr = calculateBMR(weight, height, age, isMale);
    const tdee = calculateTDEE(bmr, activityLevel);
    
    // Calculate calorie adjustment
    const calorieAdjustment = calculateCalorieAdjustment(effectiveRate);
    const dailyCalories = Math.round(tdee + calorieAdjustment);
    
    // Update state container
    if (isGaining) {
      stateContainer.textContent = `Target menaikkan berat badan ${weightChangeRate} kg/minggu`;
      stateContainer.style.backgroundColor = "#2ecc71"; // Green
    } else if (targetWeight < weight) {
      stateContainer.textContent = `Target menurunkan berat badan ${weightChangeRate} kg/minggu`;
      stateContainer.style.backgroundColor = "#e74c3c"; // Red
    } else {
      stateContainer.textContent = "Mempertahankan berat badan";
      stateContainer.style.backgroundColor = "#3498db"; // Blue
    }
    
    // Update nutrition plan
    updateNutritionPlan(tdee, dailyCalories, isGaining ? 'gain' : 'lose');
    
    // Update weight chart
    updateWeightChart(weight, targetWeight, weeksPrediction, effectiveRate);
    
    // Update estimation info
    document.querySelector('.estimation-title').textContent = 
      `Estimasi waktu: ${Math.ceil(weeksPrediction)} minggu`;
    document.querySelector('.estimation-subtitle').textContent = 
      `Dengan laju ${Math.abs(effectiveRate)} kg per minggu`;
    
    // Update weight info
    document.querySelector('.weight-info.start .weight-value').textContent = 
      `${weight.toFixed(1)} kg`;
    document.querySelector('.weight-info.target .weight-value').textContent = 
      `${targetWeight.toFixed(1)} kg`;
    
    // Show success message
    alert(`Kalkulasi selesai! Target bisa dicapai dalam ${Math.ceil(weeksPrediction)} minggu dengan asupan ${dailyCalories} kalori per hari.`);
  }
  
  // Add event listeners to calculate buttons
  calculateButtons.forEach(button => {
    button.addEventListener('click', calculatePredictions);
  });
  
  // Weight chart
  let weightChart;
  
  function updateWeightChart(startWeight, targetWeight, weeks, weeklyRate) {
    const canvas = document.getElementById('weightChart');
    const ctx = canvas.getContext('2d');
    
    // Generate weekly weight data
    const labels = [];
    const data = [];
    
    const numWeeks = Math.ceil(weeks);
    
    for (let i = 0; i <= numWeeks; i++) {
      labels.push(`Minggu ${i}`);
      data.push(startWeight + (weeklyRate * i));
    }
    
    // Destroy previous chart if it exists
    if (weightChart) {
      weightChart.destroy();
    }
    
    // Create new chart
    weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Berat Badan (kg)',
          data: data,
          borderColor: weeklyRate > 0 ? '#2ecc71' : '#e74c3c',
          backgroundColor: weeklyRate > 0 ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: Math.min(startWeight, targetWeight) * 0.9,
            suggestedMax: Math.max(startWeight, targetWeight) * 1.1
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Berat: ${context.raw.toFixed(1)} kg`;
              }
            }
          }
        }
      }
    });
  }
  
  // Update nutrition plan
  function updateNutritionPlan(tdee, dailyCalories, goalType) {
    // Update TDEE and calorie targets
    document.querySelector('.ttde-value').textContent = `${Math.round(tdee)} kkal`;
    document.querySelector('.kalori-value').textContent = `${dailyCalories} kkal`;
    
    const adjustment = Math.abs(tdee - dailyCalories);
    document.querySelector('.harian-value').textContent = `${Math.round(adjustment)} kkal`;
    
    // Update adjustment description
    if (goalType === 'gain') {
      document.querySelector('.kalori-label:nth-child(3)').textContent = "Surplus";
      document.querySelector('.harian-label:nth-child(3)').textContent = "Penambahan kalori harian";
    } else {
      document.querySelector('.kalori-label:nth-child(3)').textContent = "Defisit";
      document.querySelector('.harian-label:nth-child(3)').textContent = "Pengurangan kalori harian";
    }
    
    // Calculate macronutrient distribution
    // 50% carbs, 30% protein, 20% fat
    const carbsG = Math.round((dailyCalories * 0.5) / 4); // 4 calories per gram
    const proteinG = Math.round((dailyCalories * 0.3) / 4); // 4 calories per gram
    const fatG = Math.round((dailyCalories * 0.2) / 9); // 9 calories per gram
    
    // Update macronutrient display
    document.querySelector('.karbo-value').textContent = `${carbsG} g`;
    document.querySelector('.protein-value').textContent = `${proteinG} g`;
    document.querySelector('.lemak-value').textContent = `${fatG} g`;
    
    // Generate food recommendations based on food preference and goal
    generateFoodRecommendations(dailyCalories, goalType);
    
    // Generate activity recommendations
    generateActivityRecommendations(goalType);
  }
  
  // Generate food recommendations
  function generateFoodRecommendations(dailyCalories, goalType) {
    // Get selected food preference
    const foodPreference = document.querySelector('.tab-btn.active[data-tab="berat"]') ? 
      foodPreferenceSelect.value : foodPreferenceBMISelect.value;
    
    // Clear previous recommendations
    document.querySelector('#sarapan ul').innerHTML = '';
    document.querySelector('#makan-siang ul').innerHTML = '';
    document.querySelector('#makan-malam ul').innerHTML = '';
    document.querySelector('#cemilan ul').innerHTML = '';
    
    // Sample food recommendations based on preference and goal
    const foods = {
      omnivora: {
        sarapan: [
          "Telur orak-arik (2 butir)",
          "Roti gandum utuh (2 iris)",
          "Alpukat (1/2 buah)",
          "Susu rendah lemak (1 gelas)"
        ],
        makanSiang: [
          "Nasi merah (3/4 mangkok)",
          "Ayam panggang (100g)",
          "Sayur brokoli dan wortel (1 mangkok)",
          "Tahu goreng (50g)"
        ],
        makanMalam: [
          "Ikan panggang (120g)",
          "Quinoa (1/2 mangkok)",
          "Salad sayuran hijau (1 mangkok)",
          "Minyak zaitun (1 sdm)"
        ],
        cemilan: [
          "Pisang (1 buah)",
          "Yogurt Yunani (100g)",
          "Kacang almond (15g)",
          "Apel (1 buah)"
        ]
      },
      vegetarian: {
        sarapan: [
          "Telur orak-arik (2 butir)",
          "Roti gandum utuh (2 iris)",
          "Alpukat (1/2 buah)",
          "Susu kedelai (1 gelas)"
        ],
        makanSiang: [
          "Nasi merah (3/4 mangkok)",
          "Tahu tumis (100g)",
          "Sayur brokoli dan wortel (1 mangkok)",
          "Tempe goreng (50g)"
        ],
        makanMalam: [
          "Quorn atau protein nabati (120g)",
          "Quinoa (1/2 mangkok)",
          "Salad sayuran hijau (1 mangkok)",
          "Minyak zaitun (1 sdm)"
        ],
        cemilan: [
          "Pisang (1 buah)",
          "Yogurt Yunani (100g)",
          "Kacang almond (15g)",
          "Apel (1 buah)"
        ]
      },
      vegan: {
        sarapan: [
          "Oatmeal dengan buah-buahan (1 mangkok)",
          "Roti gandum utuh (2 iris)",
          "Alpukat (1/2 buah)",
          "Susu kedelai (1 gelas)"
        ],
        makanSiang: [
          "Nasi merah (3/4 mangkok)",
          "Tahu tumis (100g)",
          "Sayur brokoli dan wortel (1 mangkok)",
          "Tempe goreng (50g)"
        ],
        makanMalam: [
          "Burger kacang hitam (120g)",
          "Quinoa (1/2 mangkok)",
          "Salad sayuran hijau (1 mangkok)",
          "Minyak zaitun (1 sdm)"
        ],
        cemilan: [
          "Pisang (1 buah)",
          "Pudding chia (100g)",
          "Kacang almond (15g)",
          "Apel (1 buah)"
        ]
      },
      pescatarian: {
        sarapan: [
          "Telur orak-arik (2 butir)",
          "Roti gandum utuh (2 iris)",
          "Alpukat (1/2 buah)",
          "Susu rendah lemak (1 gelas)"
        ],
        makanSiang: [
          "Nasi merah (3/4 mangkok)",
          "Ikan tuna (100g)",
          "Sayur brokoli dan wortel (1 mangkok)",
          "Tahu goreng (50g)"
        ],
        makanMalam: [
          "Salmon panggang (120g)",
          "Quinoa (1/2 mangkok)",
          "Salad sayuran hijau (1 mangkok)",
          "Minyak zaitun (1 sdm)"
        ],
        cemilan: [
          "Pisang (1 buah)",
          "Yogurt Yunani (100g)",
          "Kacang almond (15g)",
          "Apel (1 buah)"
        ]
      }
    };
    
    // Adjust portions based on calorie goal
    let portionMultiplier = dailyCalories / 2000;
    if (goalType === 'lose') {
      portionMultiplier *= 0.9;
    } else if (goalType === 'gain') {
      portionMultiplier *= 1.1;
    }
    
    // Get food list for selected preference
    const selectedFoods = foods[foodPreference] || foods.omnivora;
    
    // Populate food recommendations
    populateFoodList('sarapan', selectedFoods.sarapan);
    populateFoodList('makan-siang', selectedFoods.makanSiang);
    populateFoodList('makan-malam', selectedFoods.makanMalam);
    populateFoodList('cemilan', selectedFoods.cemilan);
  }
  
  // Helper to populate food list
  function populateFoodList(mealId, foods) {
    const ul = document.querySelector(`#${mealId} ul`);
    
    foods.forEach(food => {
      const li = document.createElement('li');
      li.textContent = food;
      ul.appendChild(li);
    });
  }
  
  // Generate activity recommendations
  function generateActivityRecommendations(goalType) {
    const activityList = document.getElementById('aktivitas-list');
    activityList.innerHTML = '';
    
    const activities = goalType === 'lose' ? [
      "30-45 menit kardio intensitas sedang (jalan cepat, bersepeda, renang) 5x seminggu",
      "Latihan kekuatan 2-3x seminggu fokus pada kelompok otot besar",
      "Aktivitas NEAT (Non-Exercise Activity Thermogenesis): naik tangga, berdiri lebih banyak",
      "Peregangan atau yoga 2x seminggu untuk fleksibilitas",
      "Akumulasi 8,000-10,000 langkah per hari"
    ] : [
      "Latihan kekuatan 3-4x seminggu dengan fokus pada hypertrophy",
      "Kardio ringan 2-3x seminggu selama 20-30 menit (mempertahankan kesehatan jantung)",
      "Istirahat yang cukup: 7-9 jam tidur setiap malam",
      "Pertahankan aktivitas harian (8,000+ langkah per hari)",
      "Konsumsi protein konsisten sepanjang hari untuk mendukung pertumbuhan otot"
    ];
    
    activities.forEach(activity => {
      const li = document.createElement('li');
      li.textContent = activity;
      activityList.appendChild(li);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const aktivitasList = document.getElementById("aktivitas-list");

  // Daftar rekomendasi aktivitas harian
  const aktivitasHarian = [
    "Jalan kaki selama 30 menit",
    "Lakukan peregangan ringan selama 10 menit",
    "Lari santai selama 20 menit",
    "Lakukan latihan kekuatan tubuh seperti push-up atau plank selama 15 menit",
    "Bersepeda selama 30 menit",
    "Yoga atau meditasi selama 20 menit",
    "Berenang selama 30 menit",
  ];

  // Tambahkan aktivitas ke dalam daftar
  aktivitasHarian.forEach((aktivitas) => {
    const listItem = document.createElement("li");
    listItem.textContent = aktivitas;
    aktivitasList.appendChild(listItem);
  });
});
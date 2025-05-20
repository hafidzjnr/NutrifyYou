document.addEventListener('DOMContentLoaded', () => {
  // Navbar toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.card');
      const tabMenu = parent.querySelectorAll('.tab-btn');
      const tabContents = parent.querySelectorAll('.tab-content');
      tabMenu.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContents.forEach(tc => tc.classList.remove('active'));
      const activeTab = parent.querySelector(`#tab-${btn.dataset.tab}`);
      activeTab.classList.add('active');
    });
  });

  // Slider handlers
  function initSlider(sliderId, fillId, valueId) {
    const slider = document.getElementById(sliderId);
    const fill = document.getElementById(fillId);
    const display = document.getElementById(valueId);
    const update = () => {
      const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      fill.style.width = pct + '%';
      display.textContent = slider.value + ' kg';
    };
    slider.addEventListener('input', update);
    update();
  }
  initSlider('laju', 'slider-fill-weight', 'nilaiLaju');
  initSlider('laju_imt', 'slider-fill-imt', 'nilaiLajuIMT');

  // Data & UI elements
  const form = document.getElementById('imt-form');
  const currentImtEl = document.querySelector('.current-imt');
  const currentDescEl = document.querySelector('.result-desc');
  const targetImtEl = document.querySelector('.target-imt');
  const targetDescEl = document.querySelectorAll('.result-desc')[1];
  const currentWeightEl = document.querySelector('.current-weight');
  const targetWeightEl = document.querySelector('.target-weight');
  const stateText = document.querySelector('.text-state');

  // Nutrition & Activity plan elements
  const ttdeValue = document.querySelector('.ttde-value');
  const kaloriValue = document.querySelector('.kalori-value');
  const harianValue = document.querySelector('.harian-value');
  const macro = {
    carb: { valueEl: document.querySelector('.karbo-value'), percEl: document.querySelector('.karbo-percentage'), fillEl: document.querySelector('.karbo-fill') },
    protein: { valueEl: document.querySelector('.protein-value'), percEl: document.querySelector('.protein-percentage'), fillEl: document.querySelector('.protein-fill') },
    lemak: { valueEl: document.querySelector('.lemak-value'), percEl: document.querySelector('.lemak-percentage'), fillEl: document.querySelector('.lemak-fill') }
  };

  // Chart.js setup
  let weightChart;
  function renderChart(startWt, targetWt, weeks) {
    const labels = Array.from({ length: weeks + 1 }, (_, i) => `W${i}`);
    const data = labels.map((_, i) => startWt + ((targetWt - startWt) / weeks) * i);
    const ctx = document.getElementById('weightChart').getContext('2d');
    if (weightChart) weightChart.destroy();
    weightChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Berat (kg)', data, fill: false }] },
      options: { responsive: true, scales: { y: { beginAtZero: false } } }
    });
  }

  // BMR & TDEE calculation
  function calculateBMR(weight, height, age, gender) {
    return gender === 'Pria'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const activityFactor = { Tidak: 1.2, Sedikit: 1.375, Cukup: 1.55, Sangat: 1.725, Ekstra: 1.9 };

  // BMI categorization
  function categorizeImt(imt) {
    if (imt < 18.5) return 'Underweight';
    if (imt < 25) return 'Normal';
    if (imt < 30) return 'Overweight';
    return 'Obese';
  }

  // Main calculate function
  function calculateTargets(useImtTarget = false) {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = form.elements['jenis_kelamin'].value;
    const heightM = heightCm / 100;
    const imt = weight / (heightM * heightM);
    currentImtEl.textContent = imt.toFixed(2);
    currentDescEl.textContent = categorizeImt(imt);
    currentWeightEl.textContent = `${weight.toFixed(1)} kg`;

    let targetImt, targetWeight;
    if (useImtTarget) {
      targetImt = parseFloat(document.getElementById('target_imt').value);
      targetWeight = targetImt * heightM * heightM;
    } else {
      targetWeight = parseFloat(document.getElementById('target_berat').value);
      targetImt = targetWeight / (heightM * heightM);
    }
    targetImtEl.textContent = targetImt.toFixed(2);
    targetDescEl.textContent = categorizeImt(targetImt);
    targetWeightEl.textContent = `${targetWeight.toFixed(1)} kg`;
    stateText.textContent = 'Target siap!';

    // Timeline & estimation
    const rate = useImtTarget
      ? parseFloat(document.getElementById('laju_imt').value)
      : parseFloat(document.getElementById('laju').value);
    const diff = Math.abs(targetWeight - weight);
    const weeks = Math.ceil(diff / rate);
    document.querySelector('.estimation-title').textContent = `Estimasi waktu : ${weeks} minggu`;
    document.querySelector('.estimation-subtitle').textContent = `Dengan laju ${rate} kg per minggu`;
    renderChart(weight, targetWeight, weeks);

    // TDEE, calories, deficit
    const bmr = calculateBMR(weight, heightCm, age, gender);
    const tdee = bmr * activityFactor[document.getElementById('preferensi_makanan').value];
    ttdeValue.textContent = `${Math.round(tdee)} kcal`;
    const weeklyDeficit = rate * 7700;
    const dailyDeficit = Math.round(weeklyDeficit / 7);
    harianValue.textContent = `${dailyDeficit} kcal`;
    const targetCal = Math.round(tdee - dailyDeficit);
    kaloriValue.textContent = `${targetCal} kcal`;

    // Macro distribution
    const macros = { carb: 0.5, protein: 0.25, lemak: 0.25 };
    Object.entries(macros).forEach(([key, ratio]) => {
      const caloriesPerGram = key === 'lemak' ? 9 : 4;
      const grams = Math.round((targetCal * ratio) / caloriesPerGram);
      macro[key].valueEl.textContent = `${grams} g`;
      macro[key].percEl.textContent = `${ratio * 100}%`;
      macro[key].fillEl.style.width = `${ratio * 100}%`;
    });

    populateRecommendations();
  }

  // Recommendations pools
  const recommendations = {
    sarapan: [
      'Oatmeal dengan buah segar',
      'Telur orak-arik dan roti gandum',
      'Smoothie hijau dengan pisang dan bayam',
      'Pancake gandum utuh dengan madu',
      'Yogurt Greek dengan granola'
    ],
    'makan-siang': [
      'Nasi merah, ayam panggang, sayur kukus',
      'Salad tuna dengan quinoa',
      'Wrap ayam dan sayuran',
      'Soto ayam sehat',
      'Gado-gado rendah minyak'
    ],
    'makan-malam': [
      'Ikan panggang dan sayuran panggang',
      'Sup kacang merah dan roti gandum',
      'Tumis tahu dan brokoli',
      'Salad sayur dengan protein nabati'
    ],
    cemilan: [
      'Yogurt rendah lemak',
      'Buah pisang atau apel',
      'Kacang almond panggang',
      'Sayuran iris dengan hummus'
    ],
    cardio: [
      'Jogging 30 menit',
      'Bersepeda santai 45 menit',
      'Skipping 15 menit',
      'Berenang 30 menit'
    ],
    strength: [
      'Squat 3x12',
      'Push-up 3x10',
      'Deadlift ringan 3x10',
      'Plank 3x45 detik'
    ],
    neat: [
      'Jalan kaki setelah makan',
      'Membersihkan rumah selama 20 menit',
      'Naik tangga alih-alih lift',
      'Parkir lebih jauh dari pintu masuk'
    ],
    strecht: [
      'Yoga ringan 20 menit',
      'Stretching hamstring dan quadriceps',
      'Latihan mobilitas bahu',
      'Foam rolling otot punggung'
    ]
  };

  // Random sampling helper
  function sampleArray(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Populate recommendations with variants
  function populateRecommendations() {
    Object.keys(recommendations).forEach(key => {
      const container = document.getElementById(key);
      if (!container) return;
      const list = container.querySelector('ul');
      list.innerHTML = '';
      const items = sampleArray(recommendations[key], 2);
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
    });
  }

  // Attach calculate buttons
  document.querySelectorAll('.button-calculate').forEach(btn => {
    btn.addEventListener('click', () => {
      const useImtTarget = btn.closest('#tab-imt') != null;
      calculateTargets(useImtTarget);
    });
  });

});

document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      // Toggle navigation menu
      navLinks.classList.toggle('active');
      
      // Toggle hamburger icon animation
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
      
      // Prevent scrolling when menu is open
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Close menu when clicking a nav link
  const navItems = document.querySelectorAll('.nav-link');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('active'));
        
        document.body.classList.remove('menu-open');
      }
    });
  });
  
  // Adjust chart size on window resize
  const updateChartSize = () => {
    const chart = document.getElementById('weightChart');
    if (chart && chart.chart) {
      chart.chart.resize();
    }
  };
  
  window.addEventListener('resize', function() {
    updateChartSize();
  });
});

// Initialize particles.js
particlesJS('particles-js', {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#002950'
    },
    shape: {
      type: 'circle'
    },
    opacity: {
      value: 0.5,
      random: false
    },
    size: {
      value: 3,
      random: true
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#002950',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'grab'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1
        }
      },
      push: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true
});
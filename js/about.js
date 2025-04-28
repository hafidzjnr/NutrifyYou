document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show the corresponding tab content
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });
  
  // Range slider functionality for weight tab
  const lajuSlider = document.getElementById('laju');
  const nilaiLajuDisplay = document.getElementById('nilaiLaju');
  const sliderFillWeight = document.getElementById('slider-fill-weight');
  
  // Function to update slider fill based on value
  function updateSliderFill(slider, fill) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    fill.style.width = percentage + '%';
  }
  
  // Initial update for weight slider
  updateSliderFill(lajuSlider, sliderFillWeight);
  
  lajuSlider.addEventListener('input', function() {
    nilaiLajuDisplay.textContent = this.value + ' kg';
    updateSliderFill(lajuSlider, sliderFillWeight);
  });
  
  // Range slider functionality for BMI tab
  const lajuIMTSlider = document.getElementById('laju_imt');
  const nilaiLajuIMTDisplay = document.getElementById('nilaiLajuIMT');
  const sliderFillIMT = document.getElementById('slider-fill-imt');
  
  // Initial update for IMT slider
  updateSliderFill(lajuIMTSlider, sliderFillIMT);
  
  lajuIMTSlider.addEventListener('input', function() {
    nilaiLajuIMTDisplay.textContent = this.value + ' kg';
    updateSliderFill(lajuIMTSlider, sliderFillIMT);
  });
  
  // Initialize form data object
  const formData = {
    targetBerat: '',
    lajuPerubahan: 0.5,
    preferensiMakanan: 'omnivora',
    targetIMT: '',
    lajuPerubahanIMT: 0.5,
    preferensiMakananIMT: 'omnivora'
  };
  
  // Add event listeners to form inputs
  document.getElementById('target_berat').addEventListener('input', function() {
    formData.targetBerat = this.value;
  });
  
  lajuSlider.addEventListener('change', function() {
    formData.lajuPerubahan = parseFloat(this.value);
  });
  
  document.getElementById('preferensi_makanan').addEventListener('change', function() {
    formData.preferensiMakanan = this.value;
  });
  
  document.getElementById('target_imt').addEventListener('input', function() {
    formData.targetIMT = this.value;
  });
  
  lajuIMTSlider.addEventListener('change', function() {
    formData.lajuPerubahanIMT = parseFloat(this.value);
  });
  
  document.getElementById('preferensi_makanan_imt').addEventListener('change', function() {
    formData.preferensiMakananIMT = this.value;
  });
  
  // Calculate button functionality
  const calculateButtons = document.querySelectorAll('.button-calculate');
  
  calculateButtons.forEach(button => {
    button.addEventListener('click', function() {
      const activeTab = document.querySelector('.tab-content.active').id;
      
      if (activeTab === 'tab-berat') {
        if (!formData.targetBerat) {
          alert('Mohon masukkan target berat badan.');
          return;
        }
        console.log('Calculating with weight target:', formData);
        // Add calculation logic here
      } else if (activeTab === 'tab-imt') {
        if (!formData.targetIMT) {
          alert('Mohon masukkan target IMT.');
          return;
        }
        console.log('Calculating with BMI target:', formData);
        // Add calculation logic here
      }
    });
  });
});
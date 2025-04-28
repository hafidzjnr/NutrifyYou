document.addEventListener('DOMContentLoaded', function () {
  // Ambil elemen input dan hasil
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const targetWeightInput = document.getElementById('target_berat');
  const targetIMTInput = document.getElementById('target_imt');
  const currentIMTDisplay = document.querySelector('.current-imt');
  const targetIMTDisplay = document.querySelector('.target-imt');
  const currentWeightDisplay = document.querySelector('.current-weight');
  const targetWeightDisplay = document.querySelector('.target-weight');
  const stateContainer = document.querySelector('.text-state');
  const currentIMTDesc = document.querySelector('.result .current-imt + .result-desc');
  const targetIMTDesc = document.querySelector('.result .target-imt + .result-desc');

  // Tombol hitung
  const calculateButtons = document.querySelectorAll('.button-calculate');

  // Fungsi untuk menghitung IMT
  function calculateIMT(weight, height) {
    const heightInMeters = height / 100; // Konversi tinggi ke meter
    return (weight / (heightInMeters * heightInMeters)).toFixed(2); // Rumus IMT
  }

  // Fungsi untuk menentukan kategori IMT
  function getIMTCategory(imt) {
    if (imt < 18.5) {
      return 'Kurus';
    } else if (imt >= 18.5 && imt < 25) {
      return 'Normal';
    } else if (imt >= 25 && imt < 30) {
      return 'Gemuk';
    } else {
      return 'Obesitas';
    }
  }

  // Fungsi untuk memperbarui hasil
  function updateResults() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const targetWeight = parseFloat(targetWeightInput.value);
    const targetIMT = parseFloat(targetIMTInput.value);

    // Validasi input
    if (isNaN(weight) || isNaN(height)) {
      alert('Mohon masukkan berat badan dan tinggi badan yang valid.');
      return;
    }

    // Hitung IMT saat ini
    const currentIMT = calculateIMT(weight, height);

    // Perbarui hasil di tampilan
    currentIMTDisplay.textContent = currentIMT;
    currentWeightDisplay.textContent = `${weight} kg`;
    currentIMTDesc.textContent = getIMTCategory(currentIMT); // Tambahkan deskripsi kategori IMT saat ini

    if (!isNaN(targetWeight)) {
      targetWeightDisplay.textContent = `${targetWeight} kg`;
      const targetIMTFromWeight = calculateIMT(targetWeight, height);
      targetIMTDisplay.textContent = targetIMTFromWeight;
      targetIMTDesc.textContent = getIMTCategory(targetIMTFromWeight); // Tambahkan deskripsi kategori IMT target
      stateContainer.textContent = 'Target berat badan telah ditentukan.';
    } else if (!isNaN(targetIMT)) {
      targetIMTDisplay.textContent = targetIMT;
      const targetWeightFromIMT = (targetIMT * (height / 100) ** 2).toFixed(2);
      targetWeightDisplay.textContent = `${targetWeightFromIMT} kg`;
      targetIMTDesc.textContent = getIMTCategory(targetIMT); // Tambahkan deskripsi kategori IMT target
      stateContainer.textContent = 'Target IMT telah ditentukan.';
    } else {
      targetIMTDisplay.textContent = '-';
      targetWeightDisplay.textContent = '-';
      targetIMTDesc.textContent = '-'; // Reset deskripsi target IMT
      stateContainer.textContent = '-Belum Ada Target';
    }
  }

  // Tambahkan event listener ke tombol hitung
  calculateButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault(); // Mencegah reload halaman
      updateResults();
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get the chart canvas element
  const ctx = document.getElementById('weightChart').getContext('2d');
  
  // Define chart parameters
  const startWeight = 70.0;
  const targetWeight = 65.0;
  const weightLossPerWeek = 0.5;
  
  // Calculate number of weeks needed
  const weeksNeeded = Math.ceil((startWeight - targetWeight) / weightLossPerWeek);
  
  // Generate labels for weeks
  const labels = Array.from({length: weeksNeeded + 1}, (_, i) => i);
  
  // Generate weight data points
  const data = [];
  for (let week = 0; week <= weeksNeeded; week++) {
      // Calculate the weight for this week, but don't go below target
      const currentWeight = Math.max(startWeight - (week * weightLossPerWeek), targetWeight);
      data.push(currentWeight);
  }
  
  // Create the chart
  const weightChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Berat (kg)',
              data: data,
              borderColor: '#000',
              backgroundColor: 'transparent',
              tension: 0, // straight lines
              pointRadius: 0, // hide points
              borderWidth: 1.5
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display: false
              },
              tooltip: {
                  callbacks: {
                      title: function(tooltipItems) {
                          return 'Minggu ' + tooltipItems[0].label;
                      },
                      label: function(context) {
                          return context.parsed.y.toFixed(1) + ' kg';
                      }
                  }
              }
          },
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Minggu',
                      align: 'end'
                  },
                  grid: {
                      display: false,
                      drawBorder: true
                  },
                  ticks: {
                      display: true,
                      // Only show first and last week labels
                      callback: function(value, index, values) {
                          if (index === 0 || index === values.length - 1) {
                              return value;
                          }
                          return '';
                      }
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Berat',
                      align: 'end'
                  },
                  grid: {
                      display: false,
                      drawBorder: true
                  },
                  ticks: {
                      display: false
                  },
                  // Start slightly above the max weight for better visualization
                  min: targetWeight - 1,
                  max: startWeight + 1
              }
          },
          animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
          }
      }
  });
  
  // Update weeks needed in the title
  document.querySelector('.estimation-title').textContent = `Estimasi waktu : ${weeksNeeded} minggu`;
  document.querySelector('.estimation-subtitle').textContent = `Dengan laju ${weightLossPerWeek} kg per minggu`;
  
  // Update weight values
  document.querySelector('.start .weight-value').textContent = `${startWeight.toFixed(1)} kg`;
  document.querySelector('.target .weight-value').textContent = `${targetWeight.toFixed(1)} kg`;
});

document.addEventListener('DOMContentLoaded', function () {
  const totalKalori = 2000; // Total kalori harian (contoh)
  const distribusiMakro = {
    karbohidrat: 50, // 50% dari total kalori
    protein: 30, // 30% dari total kalori
    lemak: 20, // 20% dari total kalori
  };

  // Hitung kebutuhan makronutrien
  const kebutuhanKarbo = (distribusiMakro.karbohidrat / 100) * totalKalori / 4; // 1 gram karbohidrat = 4 kkal
  const kebutuhanProtein = (distribusiMakro.protein / 100) * totalKalori / 4; // 1 gram protein = 4 kkal
  const kebutuhanLemak = (distribusiMakro.lemak / 100) * totalKalori / 9; // 1 gram lemak = 9 kkal

  // Fungsi untuk memilih makanan
  function buatRekomendasi(kebutuhan, jenis) {
    let rekomendasi = [];
    let total = 0;

    makananList.forEach(makanan => {
      if (total < kebutuhan && makanan[jenis] > 0) {
        rekomendasi.push(makanan.nama);
        total += makanan[jenis];
      }
    });

    return rekomendasi;
  }

  // Buat rekomendasi untuk setiap waktu makan
  const sarapan = buatRekomendasi(kebutuhanKarbo / 3, 'karbohidrat');
  const makanSiang = buatRekomendasi(kebutuhanProtein / 3, 'protein');
  const makanMalam = buatRekomendasi(kebutuhanLemak / 3, 'lemak');
  const cemilan = buatRekomendasi(kebutuhanKarbo / 6, 'karbohidrat'); // Cemilan menggunakan 1/6 kebutuhan karbohidrat

  // Tampilkan rekomendasi di HTML
  const sarapanList = document.querySelector('#sarapan ul');
  const makanSiangList = document.querySelector('#makan-siang ul');
  const makanMalamList = document.querySelector('#makan-malam ul');
  const cemilanList = document.querySelector('#cemilan ul');

  sarapan.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    sarapanList.appendChild(li);
  });

  makanSiang.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    makanSiangList.appendChild(li);
  });

  makanMalam.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    makanMalamList.appendChild(li);
  });

  cemilan.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    cemilanList.appendChild(li);
  });
});

const makananList = [
  { nama: 'Dada Ayam', kalori: 165, protein: 31, karbohidrat: 0, lemak: 3.6 },
  { nama: 'Nasi Putih', kalori: 130, protein: 2.7, karbohidrat: 28, lemak: 0.3 },
  { nama: 'Telur Rebus', kalori: 68, protein: 5.5, karbohidrat: 0.6, lemak: 4.8 },
  { nama: 'Ikan Salmon', kalori: 206, protein: 22, karbohidrat: 0, lemak: 13 },
  { nama: 'Tahu', kalori: 76, protein: 8, karbohidrat: 2, lemak: 4.8 },
  { nama: 'Sayur Bayam', kalori: 23, protein: 2.9, karbohidrat: 3.6, lemak: 0.4 },
  { nama: 'Buah Apel', kalori: 52, protein: 0.3, karbohidrat: 14, lemak: 0.2 },
];
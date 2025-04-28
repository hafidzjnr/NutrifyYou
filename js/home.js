const ctx = document.getElementById('donutChart').getContext('2d');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Biru', 'Ungu', 'Abu'],
    datasets: [{
      data: [60, 25, 15],
      backgroundColor: ['#3b82f6', '#a855f7', '#e5e7eb'],
      borderWidth: 0
    }]
  },
  options: {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

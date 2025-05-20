// Get the chart context
const ctx = document.getElementById('donutChart').getContext('2d');

// Create the donut chart
const donutChart = new Chart(ctx, {
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
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }
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

document.addEventListener('DOMContentLoaded', function() {
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');
      
      if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
          navLinks.classList.toggle('active');
          
          // Animate hamburger to X
          const spans = this.querySelectorAll('span');
          spans.forEach(span => span.classList.toggle('active'));
        });
        
        // Close mobile menu when clicking a link
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
          link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.remove('active'));
          });
        });
      }
      
      // Add resize listener to handle window resize
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
          navLinks.classList.remove('active');
          
          const spans = hamburger.querySelectorAll('span');
          spans.forEach(span => span.classList.remove('active'));
        }
      });
    });

// Handle responsiveness for chart
function resizeChart() {
  const container = document.querySelector('.chart-container');
  if (window.innerWidth <= 576) {
    container.style.width = '220px';
    container.style.height = '220px';
  } else if (window.innerWidth <= 768) {
    container.style.width = '280px';
    container.style.height = '280px';
  } else if (window.innerWidth <= 1200) {
    container.style.width = '300px';
    container.style.height = '300px';
  } else {
    container.style.width = '350px';
    container.style.height = '350px';
  }
}

// Initial resize and add event listener for window resize
resizeChart();
window.addEventListener('resize', resizeChart);
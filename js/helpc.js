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

    // Enhanced floating particles
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }

    // Password toggle with smooth transition
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePassword.classList.toggle('fa-eye-slash');
      togglePassword.style.transform = 'translateY(-50%) scale(1.2)';
      setTimeout(() => {
        togglePassword.style.transform = 'translateY(-50%) scale(1)';
      }, 200);
    });

    // Enhanced password strength bar
    const strengthBar = document.getElementById('strengthBar');
    passwordInput.addEventListener('input', (e) => {
      const val = e.target.value;
      let strength = 0;
      if (val.length >= 8) strength += 25;
      if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength += 25;
      if (val.match(/\d/)) strength += 25;
      if (val.match(/[^a-zA-Z0-9]/)) strength += 25;
      
      strengthBar.style.width = strength + '%';
      
      if (strength <= 25) {
        strengthBar.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
      } else if (strength <= 50) {
        strengthBar.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc33)';
      } else if (strength <= 75) {
        strengthBar.style.background = 'linear-gradient(90deg, #88dd00, #aaff00)';
      } else {
        strengthBar.style.background = 'linear-gradient(90deg, #00cc66, #00ff88)';
      }
    });

    // Registration with enhanced feedback
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.querySelector('.register-btn');
      const btnText = btn.querySelector('span');
      const originalText = btnText.textContent;
      
      // Loading state
      btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
      btn.style.pointerEvents = 'none';

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          btnText.innerHTML = '<i class="fas fa-check"></i> Success!';
          btn.style.background = 'linear-gradient(135deg, #00cc66, #00ff88)';
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1000);
        } else {
          btnText.textContent = originalText;
          btn.style.pointerEvents = 'auto';
          alert(data.message || 'Registration failed.');
        }
      } catch (error) {
        btnText.textContent = originalText;
        btn.style.pointerEvents = 'auto';
        alert('⚠️ Server error. Please try again later.');
      }
    });
  
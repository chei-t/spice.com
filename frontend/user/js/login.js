
    // Enhanced form submission with loading state
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.querySelector('.login-btn');
      const btnSpan = btn.querySelector('span');
      const originalText = btnSpan.textContent;
      
      // Loading state
      btnSpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      btn.style.pointerEvents = 'none';

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
          btnSpan.innerHTML = '<i class="fas fa-check"></i> Success!';
          btn.style.background = 'linear-gradient(135deg, #00cc66, #00ff88)';
          
          // Store token if needed
          if (data.token) {
            sessionStorage.setItem('authToken', data.token);
          }
          
          setTimeout(() => {
            window.location.href = 'dashboard.html'; // Change to your dashboard page
          }, 1000);
        } else {
          btnSpan.textContent = originalText;
          btn.style.pointerEvents = 'auto';
          alert(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        btnSpan.textContent = originalText;
        btn.style.pointerEvents = 'auto';
        alert('⚠️ Server error. Please try again later.');
        console.error('Login error:', error);
      }
    });

    // Add input validation feedback
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
          this.style.borderColor = 'rgba(255, 69, 0, 0.6)';
        } else {
          this.style.borderColor = 'rgba(255, 140, 0, 0.2)';
        }
      });

      input.addEventListener('input', function() {
        this.style.borderColor = 'rgba(255, 140, 0, 0.2)';
      });
    });
  
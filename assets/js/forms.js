

document.addEventListener('DOMContentLoaded', () => {
// --- OTP Verification Logic ---
  const verifyEmailBtn = document.getElementById('btn-verify-email');
  const emailInput = document.getElementById('email');
  const otpContainer = document.getElementById('otp-container'); // Make sure this ID matches your HTML
  const otpInput = document.getElementById('otp_input');
  const emailFeedback = document.getElementById('email-feedback');
  const submitBtn = document.getElementById('btn-signup-submit');

  if (verifyEmailBtn && emailInput) {
    
    // 1. Handle Verify Click
    verifyEmailBtn.addEventListener('click', async () => {
      const email = emailInput.value;
      
      if (!email || !email.includes('@')) {
        emailFeedback.textContent = 'Please enter a valid email address.';
        emailFeedback.className = 'form-text text-danger';
        return;
      }

      verifyEmailBtn.disabled = true;
      verifyEmailBtn.textContent = 'Sending...';
      emailFeedback.textContent = '';

      try {
        const response = await fetch('https://backend.wiiz.it/aiwf/generate_otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        // --- FIXED LOGIC HERE: Check if response.ok is true ---
        if (response.ok) { 
          // SUCCESS! Show the OTP box
          emailFeedback.textContent = 'OTP sent! Please check your email.';
          emailFeedback.className = 'form-text text-success'; // Green text
          
          if(otpContainer) {
            otpContainer.style.display = 'block'; // Unhide the box
          } else {
            console.error("OTP Container not found in HTML");
          }
          
          verifyEmailBtn.textContent = 'Resend OTP';
        } else {
          // Server returned an error (like 400 or 500)
          throw new Error(data.message || 'Failed to send OTP.');
        }

      } catch (error) {
        console.error(error);
        emailFeedback.textContent = error.message || 'Error sending OTP.';
        emailFeedback.className = 'form-text text-danger'; // Red text
        verifyEmailBtn.textContent = 'Verify Email';
      } finally {
        verifyEmailBtn.disabled = false;
      }
    });

    // 2. Enable Submit Button only when OTP is entered
    if (otpInput) {
      otpInput.addEventListener('input', function() {
        if (this.value.length === 6 && emailInput.value) {
          submitBtn.disabled = false;
        } else {
          submitBtn.disabled = true;
        }
      });
    }

    // 3. Reset if user changes email
    emailInput.addEventListener('input', () => {
      if(otpContainer) otpContainer.style.display = 'none';
      if(otpInput) otpInput.value = '';
      submitBtn.disabled = true;
      verifyEmailBtn.textContent = 'Verify Email';
      emailFeedback.textContent = '';
    });
  }
  // --- Authentication View Toggles ---
  const signupView = document.getElementById('signup-view');
  const loginView = document.getElementById('login-view');
  const showLoginBtn = document.getElementById('show-login');
  const showSignupBtn = document.getElementById('show-signup');

  if (showLoginBtn && showSignupBtn && signupView && loginView) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupView.style.display = 'none';
      loginView.style.display = 'block';
    });

    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginView.style.display = 'none';
      signupView.style.display = 'block';
    });
  }

  // --- Live validation to allow only numbers in phone fields ---
  function enforceNumericInput(event) {
    // Replace any character that is not a number with an empty string
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  const signupPhoneField = document.querySelector('#signup-form input[name="phone"]');
  if (signupPhoneField) {
    signupPhoneField.addEventListener('input', enforceNumericInput);
  }

  const partnerPhoneField = document.querySelector('#partner-form input[name="mobilephone"]');
  if (partnerPhoneField) {
    partnerPhoneField.addEventListener('input', enforceNumericInput);
  }
  // --- End of live validation ---


  // --- 1. Contact Us Form Handler ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const form = this;
      const loading = form.querySelector('.loading');
      const errorMessage = form.querySelector('.error-message');
      const sentMessage = form.querySelector('.sent-message');


      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        errorMessage.textContent = 'Please complete the reCAPTCHA.';
        errorMessage.style.display = 'block';
        return;
      }
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        linkedin_profile: formData.get('linkedin_profile'),
        recaptcha_token: recaptchaResponse
      };

      try {
        const response = await fetch('https://utility.wiiz.it/api/contactMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        loading.style.display = 'none';
        sentMessage.style.display = 'block';
        form.reset();

      } catch (error) {
        console.error('Error submitting contact form:', error);
        loading.style.display = 'none';
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      } finally {
        grecaptcha.reset();
      }
    });
  }


  // --- 2. Sign Up Form Handler (YOUR ORIGINAL API) ---
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const form = this;
      const loading = form.querySelector('.loading');
      const errorMessage = form.querySelector('.error-message');
      const sentMessage = form.querySelector('.sent-message');
      const recaptchaResponse = grecaptcha.getResponse(form.querySelector('.g-recaptcha').dataset.widgetId);
      if (!recaptchaResponse) {
        errorMessage.textContent = 'Please complete the reCAPTCHA.';
        errorMessage.style.display = 'block';
        return;
      }
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      const password = form.querySelector('input[name="password"]').value;
      const confirmPassword = form.querySelector('input[name="confirm_password"]').value;

      // --- Client-side validation: Check password length ---
      if (password.length < 8) {
        loading.style.display = 'none';
        errorMessage.textContent = 'Password must be at least 8 characters long.';
        errorMessage.style.display = 'block';
        return; // Stop the submission
      }

      // --- Client-side validation: Check if passwords match ---
      if (password !== confirmPassword) {
        loading.style.display = 'none';
        errorMessage.textContent = 'Passwords do not match. Please try again.';
        errorMessage.style.display = 'block';
        return; // Stop the submission
      }

      // Construct the payload for your API
     // Get the OTP value
      const otpValue = form.querySelector('input[name="otp"]').value;

      const data = {
        first_name: form.querySelector('input[name="first_name"]').value,
        last_name: form.querySelector('input[name="last_name"]').value,
        username: form.querySelector('input[name="username"]').value,
        email: form.querySelector('input[name="email"]').value,
        password: password,
        plan: "free_trial",
        otp: otpValue, // Added OTP here
        recaptcha_token: recaptchaResponse
      };
      // START: Replace the entire try...catch block with this
      try {
        // New API endpoint
        const response = await fetch('https://backend.wiiz.it/aiwf/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          // Try to get a more specific error message from the API response
          throw new Error(responseData.message || 'An unknown error occurred during signup.');
        }

        // --- SUCCESS LOGIC: HIDE THE VIEW and SHOW THE MODAL ---
        loading.style.display = 'none';
        // Trigger Google Ads conversion
        if (typeof gtag_report_conversion === "function") {
          gtag_report_conversion();
        }
         if (typeof gtag === "function") {
        console.log("Triggering Google Ads conversion event");
        gtag('event', 'sign_up', {
          debug_mode: true
        });
      }
        // Find the entire signup view container and hide it
        const signupView = document.getElementById('signup-view');
        if (signupView) {
          signupView.style.display = 'none';
        }

        // Create and show the Bootstrap success modal
        const successModalEl = document.getElementById('successModal');
        if (successModalEl) {
          const successModal = new bootstrap.Modal(successModalEl);
          successModal.show();
        } else {
          // Fallback if modal isn't found (shows the old text message)
          sentMessage.style.display = 'block';
          form.reset();
        }

      } catch (error) {
        // --- ERROR LOGIC ---
        console.error('Error submitting signup form:', error);
        loading.style.display = 'none';
        errorMessage.textContent = error.message; // Display the actual error from the API
        errorMessage.style.display = 'block';
      } finally {
        grecaptcha.reset(form.querySelector('.g-recaptcha').dataset.widgetId);
      }
      // END: Stop replacing here
    });
  }


  // --- 3. Partner Program Form Handler ---
  const partnerForm = document.getElementById('partner-form');
  if (partnerForm) {
    partnerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const form = this;
      const loading = form.querySelector('.loading');
      const errorMessage = form.querySelector('.error-message');
      const sentMessage = form.querySelector('.sent-message');

      // --- VALIDATION ADDED ---
      // Check if the mobile phone field contains only numbers
      const mobilePhoneField = form.querySelector('input[name="mobilephone"]');
      const phoneRegex = /^[0-9]*$/; // Allows empty or numbers only

      if (!phoneRegex.test(mobilePhoneField.value)) {
        errorMessage.textContent = 'Mobile Phone must contain only numbers.';
        errorMessage.style.display = 'block';
        return; // Stop the form submission
      }
      // --- END OF VALIDATION ---
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        errorMessage.textContent = 'Please complete the reCAPTCHA.';
        errorMessage.style.display = 'block';
        return;
      }
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      const programSI = form.querySelector('#program_si').checked ? 'Yes' : 'No';
      const programTech = form.querySelector('#program_tech').checked ? 'Yes' : 'No';
      const programEdu = form.querySelector('#program_edu').checked ? 'Yes' : 'No';

      const data = {
        first_name: form.querySelector('input[name="firstname"]').value,
        last_name: form.querySelector('input[name="lastname"]').value,
        email: form.querySelector('input[name="email"]').value,
        job_title: form.querySelector('input[name="jobtitle"]').value,
        mobile_phone: mobilePhoneField.value,
        organization: form.querySelector('input[name="company"]').value,
        company_website: form.querySelector('input[name="companywebsite"]').value,
        primary_industry: form.querySelector('select[name="industry"]').value,
        program_system_integration: programSI,
        program_technology: programTech,
        program_education: programEdu,
        linkedin_profile: form.querySelector('input[name="linkedin_profile"]').value,
        recaptcha_token: recaptchaResponse
      };

      try {
        const response = await fetch('https://utility.wiiz.it/api/partnerProgram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        loading.style.display = 'none';
        sentMessage.style.display = 'block';
        form.reset();

      } catch (error) {
        console.error('Error submitting partner form:', error);
        loading.style.display = 'none';
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      } finally {
        grecaptcha.reset();
      }
    });
  }


  // --- 4. Login Form Handler (YOUR ORIGINAL API) ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const form = this;
      const loading = form.querySelector('.loading');
      const errorMessage = form.querySelector('.error-message');
      const sentMessage = form.querySelector('.sent-message');
      const recaptchaResponse = grecaptcha.getResponse(form.querySelector('.g-recaptcha').dataset.widgetId);
      if (!recaptchaResponse) {
        errorMessage.textContent = 'Please complete the reCAPTCHA.';
        errorMessage.style.display = 'block';
        return;
      }
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      const data = {
        username: form.querySelector('input[name="username"]').value,
        password: form.querySelector('input[name="password"]').value,
        recaptcha_token: recaptchaResponse
      };

      try {
        // YOUR ORIGINAL API ENDPOINT
        const response = await fetch('https://backend.wiiz.it/aiwf/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
        }

        // --- Save to Local Storage ---
        if (responseData.access_token) {
          // Save the token
          localStorage.setItem('wiizAuthToken', responseData.access_token);

          // Create a new object for user data, excluding the 'projects' array
          const userToStore = {
            email: responseData.email,
            username: responseData.username,
            first_name: responseData.first_name,
            display_name: responseData.display_name,
            role: responseData.role,
            plan: responseData.plan,
            org_id: responseData.org_id,
            team_id: responseData.team_id,
            admin_name: responseData.admin_name,
            zoho_customer_id: responseData.zoho_customer_id
          };

          // Save the filtered user data
          localStorage.setItem('wiizUserData', JSON.stringify(userToStore));
        }

        loading.style.display = 'none';
        sentMessage.textContent = 'Login successful! Redirecting...';
        sentMessage.style.display = 'block';

        // Redirect to index.html after a 1-second delay
        setTimeout(() => {
          window.location.href = 'pricing.html';
        }, 1000);

      } catch (error) {
        console.error('Error submitting login form:', error);
        loading.style.display = 'none';
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
      } finally {
        grecaptcha.reset(form.querySelector('.g-recaptcha').dataset.widgetId);
      }
    });
  }

});
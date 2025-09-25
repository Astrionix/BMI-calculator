document.addEventListener('DOMContentLoaded', function() {
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
                value: '#ffffff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
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
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
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
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });

    // DOM Elements
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const scalePointer = document.getElementById('scale-pointer');

    // Add input animations
    [weightInput, heightInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Calculate BMI function
    calculateBtn.addEventListener('click', async function() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            showError('Please enter valid weight and height values');
            return;
        }

        // Show loading animation
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
        calculateBtn.disabled = true;

        try {
            // Call the BMI API
            const response = await fetch(`https://bmicalculatorapi.vercel.app/api/bmi/${weight}/${height}`);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            displayResult(data);
        } catch (error) {
            console.error('Error calculating BMI:', error);
            showError('Failed to calculate BMI. Please try again.');
        } finally {
            // Reset button
            calculateBtn.innerHTML = 'Calculate BMI';
            calculateBtn.disabled = false;
        }
    });

    // Display BMI result
    function displayResult(data) {
        const bmi = data.bmi;
        const category = getBMICategory(bmi);
        const pointerPosition = getBMIPointerPosition(bmi);

        // Update result values with animation
        bmiValue.textContent = bmi.toFixed(1);
        bmiCategory.textContent = category.name;
        bmiCategory.style.color = category.color;

        // Update pointer position
        scalePointer.style.left = `${pointerPosition}%`;

        // Show result with animation
        resultDiv.classList.remove('show');
        setTimeout(() => {
            resultDiv.classList.add('show');
        }, 10);
    }

    // Get BMI category and color
    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return { name: 'Underweight', color: 'var(--underweight-color)' };
        } else if (bmi >= 18.5 && bmi < 25) {
            return { name: 'Normal weight', color: 'var(--normal-color)' };
        } else if (bmi >= 25 && bmi < 30) {
            return { name: 'Overweight', color: 'var(--overweight-color)' };
        } else {
            return { name: 'Obese', color: 'var(--obese-color)' };
        }
    }

    // Calculate pointer position based on BMI
    function getBMIPointerPosition(bmi) {
        // Map BMI value to percentage position on the scale (0-100%)
        if (bmi < 15) return 5; // Minimum position
        if (bmi > 35) return 95; // Maximum position
        
        // Map BMI ranges to positions on the scale
        if (bmi < 18.5) {
            // Underweight: 5-25%
            return 5 + ((bmi - 15) / 3.5) * 20;
        } else if (bmi < 25) {
            // Normal: 25-50%
            return 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi < 30) {
            // Overweight: 50-75%
            return 50 + ((bmi - 25) / 5) * 25;
        } else {
            // Obese: 75-95%
            return 75 + ((bmi - 30) / 5) * 20;
        }
    }

    // Show error message
    function showError(message) {
        resultDiv.innerHTML = `<div class="error-message">${message}</div>`;
        resultDiv.classList.add('show');
        resultDiv.style.backgroundColor = '#ffebee';
        resultDiv.style.color = '#d32f2f';
        
        // Reset after 3 seconds
        setTimeout(() => {
            resultDiv.classList.remove('show');
            setTimeout(() => {
                // Reset the result div to its original state
                resultDiv.innerHTML = `
                    <div class="result-value">Your BMI: <span id="bmi-value">--</span></div>
                    <div class="result-category">Category: <span id="bmi-category">--</span></div>
                    <div class="bmi-scale">
                        <div class="scale-item underweight">Underweight</div>
                        <div class="scale-item normal">Normal</div>
                        <div class="scale-item overweight">Overweight</div>
                        <div class="scale-item obese">Obese</div>
                        <div class="scale-pointer" id="scale-pointer"></div>
                    </div>
                `;
                resultDiv.style.backgroundColor = '';
                resultDiv.style.color = '';
                
                // Reassign DOM elements that were recreated
                bmiValue = document.getElementById('bmi-value');
                bmiCategory = document.getElementById('bmi-category');
                scalePointer = document.getElementById('scale-pointer');
            }, 300);
        }, 3000);
    }

    // Add button ripple effect
    calculateBtn.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        ripple.classList.add('active');
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
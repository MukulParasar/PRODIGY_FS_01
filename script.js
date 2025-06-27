// Simulated user database with hashed passwords
        const users = {
            'admin@example.com': {
                id: 1,
                name: 'System Administrator',
                email: 'admin@example.com',
                password: 'hashed_admin123', // In real app: bcrypt hash
                role: 'admin'
            },
            'user@example.com': {
                id: 2,
                name: 'Standard User',
                email: 'user@example.com',
                password: 'hashed_user123', // In real app: bcrypt hash
                role: 'user'
            }
        };

        // Current session management
        let currentSession = {
            user: null,
            sessionId: null,
            loginTime: null,
            isAuthenticated: false
        };

        // Page navigation
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        // Password visibility toggle
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '🙈';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        }

        // Generate session ID
        function generateSessionId() {
            return 'sess_' + Math.random().toString(36).substr(2, 16);
        }

        // Hash password (simulated - in real app use bcrypt)
        function hashPassword(password) {
            return 'hashed_' + password;
        }

        // Validate password strength
        function validatePassword(password) {
            if (password.length < 6) {
                return 'Password must be at least 6 characters long';
            }
            return null;
        }

        // Show alert message
        function showAlert(elementId, message, type = 'error') {
            const alert = document.getElementById(elementId);
            alert.textContent = message;
            alert.className = `alert alert-${type}`;
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }

        // Login form handler
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Input validation
            if (!email || !password) {
                showAlert('loginAlert', 'Please fill in all fields');
                return;
            }

            // Authenticate user
            const user = users[email];
            if (!user || user.password !== hashPassword(password)) {
                showAlert('loginAlert', 'Invalid email or password');
                return;
            }

            // Create secure session
            currentSession = {
                user: user,
                sessionId: generateSessionId(),
                loginTime: new Date().toLocaleString(),
                isAuthenticated: true
            };

            // Redirect to dashboard
            loadDashboard();
        });

        // Registration form handler
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const role = document.getElementById('registerRole').value;
            
            // Input validation
            if (!name || !email || !password || !role) {
                showAlert('registerAlert', 'Please fill in all fields', 'error');
                return;
            }

            // Password validation
            const passwordError = validatePassword(password);
            if (passwordError) {
                showAlert('registerAlert', passwordError, 'error');
                return;
            }

            // Check if user already exists
            if (users[email]) {
                showAlert('registerAlert', 'User already exists with this email', 'error');
                return;
            }

            // Create new user (in real app, save to database)
            const newUser = {
                id: Object.keys(users).length + 1,
                name: name,
                email: email,
                password: hashPassword(password),
                role: role
            };

            users[email] = newUser;

            showAlert('registerAlert', 'Account created successfully! You can now log in.', 'success');
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                showPage('loginPage');
            }, 2000);
        });

        // Load dashboard with user data
        function loadDashboard() {
            if (!currentSession.isAuthenticated) {
                showPage('loginPage');
                return;
            }

            const user = currentSession.user;
            
            // Update user info
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            document.getElementById('loginTime').textContent = currentSession.loginTime;
            document.getElementById('sessionId').textContent = currentSession.sessionId;
            
            // Set user avatar based on role
            const avatar = document.getElementById('userAvatar');
            avatar.textContent = user.role === 'admin' ? '👨‍💼' : '👤';
            
            // Show admin features if user is admin
            if (user.role === 'admin') {
                document.getElementById('adminFeature').style.display = 'block';
            }
            
            showPage('dashboardPage');
        }

        // Logout function
        function logout() {
            // Clear session
            currentSession = {
                user: null,
                sessionId: null,
                loginTime: null,
                isAuthenticated: false
            };
            
            // Reset forms
            document.getElementById('loginForm').reset();
            document.getElementById('loginEmail').value = 'admin@example.com';
            document.getElementById('loginPassword').value = 'admin123';
            
            // Hide admin features
            document.getElementById('adminFeature').style.display = 'none';
            
            showPage('loginPage');
        }

        // Check authentication on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Set default values for demo
            document.getElementById('loginEmail').value = 'admin@example.com';
            document.getElementById('loginPassword').value = 'admin123';
        });

        // Simulate protected route access
        function accessProtectedRoute(route) {
            if (!currentSession.isAuthenticated) {
                alert('Access denied. Please log in first.');
                return false;
            }
            
            // Role-based access control
            if (route === 'admin' && currentSession.user.role !== 'admin') {
                alert('Access denied. Administrator privileges required.');
                return false;
            }
            
            alert(`Access granted to ${route} section!`);
            return true;
        }

        // Add click handlers to feature cards
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.feature-card').forEach(card => {
                card.addEventListener('click', function() {
                    const title = this.querySelector('h4').textContent.toLowerCase();
                    const route = title === 'user management' ? 'admin' : 'user';
                    accessProtectedRoute(route);
                });
            });
        });
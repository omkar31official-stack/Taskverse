// Global state
let currentUserRole = 'employer';
let database = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    database = window.taskverseDB || initializeDatabase();
    
    // Setup event listeners
    setupRoleSwitch();
    setupNavigation();
    
    // Load appropriate page functionality
    const path = window.location.pathname;
    if (path.includes('post-outcome')) {
        setupOutcomeForm();
    } else if (path.includes('candidate-profile')) {
        setupProfileForm();
    } else if (path.includes('match-results')) {
        loadMatchResults();
    } else if (path.includes('feedback')) {
        setupFeedbackForm();
    }
});

// Database initialization
function initializeDatabase() {
    const db = {
        users: JSON.parse(localStorage.getItem('taskverse_users')) || [
            {
                id: 1,
                name: "Alex Chen",
                role: "candidate",
                github: "https://github.com/alexchen",
                skills: { "React": 0.95, "Node.js": 0.88, "Python": 0.92, "MongoDB": 0.85 },
                reliability: 0.94,
                proofScore: 0.91
            },
            {
                id: 2,
                name: "Sarah Johnson",
                role: "candidate",
                github: "https://github.com/sarahj",
                skills: { "React": 0.88, "TypeScript": 0.95, "AWS": 0.82, "GraphQL": 0.90 },
                reliability: 0.88,
                proofScore: 0.87
            },
            {
                id: 3,
                name: "Mike Rodriguez",
                role: "employer",
                github: "",
                skills: {},
                reliability: 0,
                proofScore: 0
            }
        ],
        
        outcomes: JSON.parse(localStorage.getItem('taskverse_outcomes')) || [
            {
                id: 1,
                employer_id: 3,
                description: "Build a responsive dashboard with real-time analytics and interactive charts. Should include user management and data export functionality.",
                required_skills: ["React", "Chart.js", "Node.js", "JWT"],
                tasks: ["Create dashboard layout", "Implement charts", "Add user authentication", "Build data export feature"],
                complexity: 0.8,
                deadline: "2024-03-15"
            },
            {
                id: 2,
                employer_id: 3,
                description: "Develop a machine learning model for sentiment analysis on customer reviews with accuracy above 90%.",
                required_skills: ["Python", "TensorFlow", "NLP", "Pandas"],
                tasks: ["Data preprocessing", "Model training", "Accuracy testing", "Deployment script"],
                complexity: 0.9,
                deadline: "2024-04-01"
            }
        ],
        
        matches: JSON.parse(localStorage.getItem('taskverse_matches')) || [
            { candidate_id: 1, outcome_id: 1, fit_score: 0.92 },
            { candidate_id: 2, outcome_id: 1, fit_score: 0.85 },
            { candidate_id: 1, outcome_id: 2, fit_score: 0.78 }
        ],
        
        feedback: JSON.parse(localStorage.getItem('taskverse_feedback')) || [
            { candidate_id: 1, outcome_id: 1, rating: 5, on_time: true }
        ]
    };
    
    // Save to localStorage
    localStorage.setItem('taskverse_users', JSON.stringify(db.users));
    localStorage.setItem('taskverse_outcomes', JSON.stringify(db.outcomes));
    localStorage.setItem('taskverse_matches', JSON.stringify(db.matches));
    localStorage.setItem('taskverse_feedback', JSON.stringify(db.feedback));
    
    return db;
}

// Role switching
function setupRoleSwitch() {
    const roleSwitchBtn = document.getElementById('roleSwitch');
    if (roleSwitchBtn) {
        roleSwitchBtn.addEventListener('click', function() {
            currentUserRole = currentUserRole === 'employer' ? 'candidate' : 'employer';
            
            const roleSpan = document.querySelector('.user-role');
            if (roleSpan) {
                roleSpan.textContent = currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1);
            }
            
            if (roleSwitchBtn) {
                roleSwitchBtn.textContent = `Switch to ${currentUserRole === 'employer' ? 'Candidate' : 'Employer'}`;
            }
            
            // Update navigation based on role
            updateNavigationForRole();
        });
    }
}

function updateNavigationForRole() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (currentUserRole === 'employer' && link.href.includes('candidate-profile')) {
            link.style.display = 'none';
        } else if (currentUserRole === 'candidate' && link.href.includes('post-outcome')) {
            link.style.display = 'none';
        } else {
            link.style.display = 'block';
        }
    });
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Outcome Form
function setupOutcomeForm() {
    const form = document.getElementById('outcomeForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const description = document.getElementById('outcomeDescription').value;
            const deadline = document.getElementById('deadline').value;
            
            // Show processing state
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Outcome...';
            submitBtn.disabled = true;
            
            try {
                // Simulate AI analysis
                const analysis = await analyzeOutcome(description);
                
                // Create outcome object
                const newOutcome = {
                    id: database.outcomes.length + 1,
                    employer_id: 3, // Current employer
                    description: description,
                    required_skills: analysis.skills,
                    tasks: analysis.tasks,
                    complexity: analysis.complexity,
                    deadline: deadline,
                    created_at: new Date().toISOString()
                };
                
                // Save to database
                database.outcomes.push(newOutcome);
                localStorage.setItem('taskverse_outcomes', JSON.stringify(database.outcomes));
                
                // Generate matches
                generateMatches(newOutcome);
                
                // Show success message
                alert('✅ Outcome contract created successfully! AI analysis complete. Checking for candidate matches...');
                
                // Reset form
                form.reset();
                
                // Redirect to match results
                setTimeout(() => {
                    window.location.href = 'match-results.html';
                }, 1500);
                
            } catch (error) {
                alert('Error analyzing outcome: ' + error.message);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// AI Outcome Analysis (Simulated)
async function analyzeOutcome(description) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI analysis based on keywords
    const keywords = description.toLowerCase();
    const skills = [];
    const tasks = [];
    let complexity = 0.5;
    
    // Extract skills
    if (keywords.includes('react') || keywords.includes('frontend') || keywords.includes('ui')) {
        skills.push('React');
    }
    if (keywords.includes('node') || keywords.includes('backend') || keywords.includes('api')) {
        skills.push('Node.js');
    }
    if (keywords.includes('python') || keywords.includes('ml') || keywords.includes('ai')) {
        skills.push('Python');
    }
    if (keywords.includes('database') || keywords.includes('mongodb') || keywords.includes('sql')) {
        skills.push('MongoDB');
    }
    if (keywords.includes('aws') || keywords.includes('cloud') || keywords.includes('deploy')) {
        skills.push('AWS');
    }
    
    // Extract tasks
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    tasks.push(...sentences.slice(0, 3).map(s => s.trim()));
    
    // Calculate complexity
    const wordCount = description.split(/\s+/).length;
    if (wordCount > 100) complexity = 0.8;
    if (wordCount > 200) complexity = 0.9;
    if (skills.length > 3) complexity = Math.min(complexity + 0.1, 0.95);
    
    return {
        skills: skills.length > 0 ? skills : ['JavaScript', 'HTML/CSS'],
        tasks: tasks.length > 0 ? tasks : ['Implementation', 'Testing', 'Deployment'],
        complexity: complexity
    };
}

// Profile Form
function setupProfileForm() {
    // Skill selection
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // GitHub validation
    const githubInput = document.getElementById('githubLink');
    if (githubInput) {
        githubInput.addEventListener('blur', function() {
            const url = this.value;
            if (url && !url.startsWith('https://github.com/')) {
                alert('Please enter a valid GitHub URL (starting with https://github.com/)');
                this.value = '';
            }
        });
    }
    
    // Proof upload
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,.pdf,.zip';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    uploadArea.innerHTML = `
                        <i class="fas fa-check-circle" style="color: var(--success);"></i>
                        <h3>${file.name}</h3>
                        <p>${(file.size / 1024).toFixed(1)} KB • Uploaded successfully</p>
                    `;
                    calculateProofScore();
                }
            };
            input.click();
        });
    }
    
    // Profile form submission
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('candidateName').value;
            const github = document.getElementById('githubLink').value;
            
            // Get selected skills
            const selectedSkills = {};
            document.querySelectorAll('.skill-tag.selected').forEach(tag => {
                const skill = tag.textContent;
                // Simulate skill confidence based on proof upload
                const confidence = Math.random() * 0.3 + 0.7; // 0.7-1.0
                selectedSkills[skill] = confidence;
            });
            
            // Create/update user profile
            const existingUser = database.users.find(u => u.name === name);
            if (existingUser) {
                existingUser.github = github;
                existingUser.skills = selectedSkills;
                existingUser.proofScore = calculateProofScore();
            } else {
                const newUser = {
                    id: database.users.length + 1,
                    name: name,
                    role: 'candidate',
                    github: github,
                    skills: selectedSkills,
                    reliability: 0.9, // Default reliability
                    proofScore: calculateProofScore()
                };
                database.users.push(newUser);
            }
            
            localStorage.setItem('taskverse_users', JSON.stringify(database.users));
            
            alert('✅ Profile updated successfully! Skill confidence scores calculated.');
            form.reset();
            document.querySelectorAll('.skill-tag.selected').forEach(tag => {
                tag.classList.remove('selected');
            });
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <h3>Upload Proof of Skill</h3>
                <p>Drag & drop or click to upload screenshots, GitHub repos, certificates</p>
            `;
        });
    }
}

function calculateProofScore() {
    // Simulate proof analysis
    return Math.random() * 0.4 + 0.6; // 0.6-1.0
}

// Match Results
function loadMatchResults() {
    const container = document.getElementById('matchResults');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Load each outcome with top matches
    database.outcomes.forEach(outcome => {
        const matches = database.matches
            .filter(m => m.outcome_id === outcome.id)
            .sort((a, b) => b.fit_score - a.fit_score)
            .slice(0, 3);
        
        if (matches.length > 0) {
            const outcomeCard = document.createElement('div');
            outcomeCard.className = 'result-card';
            
            let candidatesHTML = '';
            matches.forEach(match => {
                const candidate = database.users.find(u => u.id === match.candidate_id);
                if (candidate) {
                    candidatesHTML += `
                        <div class="candidate-match">
                            <div class="candidate-header">
                                <h4>${candidate.name}</h4>
                                <span class="fit-score">Fit: ${match.fit_score.toFixed(2)}</span>
                            </div>
                            <div class="candidate-details">
                                <p><strong>Skills:</strong> ${Object.keys(candidate.skills).join(', ')}</p>
                                <p><strong>Reliability:</strong> ${(candidate.reliability * 100).toFixed(0)}%</p>
                                <p><strong>Proof Score:</strong> ${(candidate.proofScore * 100).toFixed(0)}%</p>
                            </div>
                            <button class="btn-allocate" onclick="allocateWork(${outcome.id}, ${candidate.id})">
                                <i class="fas fa-check-circle"></i> Allocate Work
                            </button>
                        </div>
                    `;
                }
            });
            
            outcomeCard.innerHTML = `
                <div class="result-header">
                    <div class="result-title">Outcome: ${outcome.description.substring(0, 60)}...</div>
                    <div class="result-meta">
                        <span>Deadline: ${new Date(outcome.deadline).toLocaleDateString()}</span>
                        <span>Complexity: ${(outcome.complexity * 100).toFixed(0)}%</span>
                    </div>
                </div>
                <div class="required-skills">
                    <strong>Required Skills:</strong> ${outcome.required_skills.join(', ')}
                </div>
                <h4 style="margin: 20px 0 10px 0;">Top Matches:</h4>
                <div class="candidates-list">
                    ${candidatesHTML}
                </div>
            `;
            
            container.appendChild(outcomeCard);
        }
    });
}

function generateMatches(outcome) {
    const candidates = database.users.filter(u => u.role === 'candidate');
    
    candidates.forEach(candidate => {
        // Calculate fit score
        const skillMatch = calculateSkillMatch(candidate.skills, outcome.required_skills);
        const proofScore = candidate.proofScore || 0.8;
        const reliability = candidate.reliability || 0.9;
        
        const fitScore = skillMatch * 0.5 + proofScore * 0.3 + reliability * 0.2;
        
        // Only save matches with decent fit
        if (fitScore > 0.6) {
            const existingMatch = database.matches.find(
                m => m.candidate_id === candidate.id && m.outcome_id === outcome.id
            );
            
            if (!existingMatch) {
                database.matches.push({
                    candidate_id: candidate.id,
                    outcome_id: outcome.id,
                    fit_score: fitScore
                });
            }
        }
    });
    
    localStorage.setItem('taskverse_matches', JSON.stringify(database.matches));
}

function calculateSkillMatch(candidateSkills, requiredSkills) {
    if (!candidateSkills || Object.keys(candidateSkills).length === 0) return 0;
    if (!requiredSkills || requiredSkills.length === 0) return 0;
    
    let totalMatch = 0;
    requiredSkills.forEach(skill => {
        if (candidateSkills[skill]) {
            totalMatch += candidateSkills[skill];
        }
    });
    
    return totalMatch / requiredSkills.length;
}

function allocateWork(outcomeId, candidateId) {
    if (confirm('Are you sure you want to allocate this work to this candidate?')) {
        // In a real app, this would send a notification
        alert('Work allocated successfully! The candidate has been notified.');
        
        // Remove the match since it's now allocated
        database.matches = database.matches.filter(
            m => !(m.outcome_id === outcomeId && m.candidate_id === candidateId)
        );
        localStorage.setItem('taskverse_matches', JSON.stringify(database.matches));
        
        // Reload matches
        loadMatchResults();
    }
}

// Feedback Form
function setupFeedbackForm() {
    // Star rating
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            updateStars();
        });
        
        star.addEventListener('mouseover', function() {
            highlightStars(index);
        });
    });
    
    document.querySelector('.rating-stars').addEventListener('mouseleave', function() {
        updateStars();
    });
    
    function updateStars() {
        stars.forEach((star, index) => {
            if (index < currentRating) {
                star.classList.add('active');
                star.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                star.classList.remove('active');
                star.innerHTML = '<i class="far fa-star"></i>';
            }
        });
        document.getElementById('ratingValue').value = currentRating;
    }
    
    function highlightStars(index) {
        stars.forEach((star, i) => {
            if (i <= index) {
                star.innerHTML = '<i class="fas fa-star"></i>';
                star.style.color = 'var(--warning)';
            } else {
                star.innerHTML = '<i class="far fa-star"></i>';
                star.style.color = 'var(--gray-light)';
            }
        });
    }
    
    // Feedback form submission
    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const candidateId = parseInt(document.getElementById('candidateSelect').value);
            const outcomeId = parseInt(document.getElementById('outcomeSelect').value);
            const rating = parseInt(document.getElementById('ratingValue').value);
            const onTime = document.getElementById('onTime').checked;
            
            if (!candidateId || !outcomeId || rating === 0) {
                alert('Please fill in all fields');
                return;
            }
            
            // Save feedback
            const newFeedback = {
                candidate_id: candidateId,
                outcome_id: outcomeId,
                rating: rating,
                on_time: onTime,
                date: new Date().toISOString()
            };
            
            database.feedback.push(newFeedback);
            localStorage.setItem('taskverse_feedback', JSON.stringify(database.feedback));
            
            // Update candidate reliability
            updateCandidateReliability(candidateId, rating, onTime);
            
            alert('✅ Feedback submitted successfully! Candidate reliability score updated.');
            form.reset();
            currentRating = 0;
            updateStars();
        });
        
        // Populate dropdowns
        populateFeedbackDropdowns();
    }
}

function populateFeedbackDropdowns() {
    const candidateSelect = document.getElementById('candidateSelect');
    const outcomeSelect = document.getElementById('outcomeSelect');
    
    if (candidateSelect) {
        const candidates = database.users.filter(u => u.role === 'candidate');
        candidateSelect.innerHTML = '<option value="">Select Candidate</option>' +
            candidates.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    
    if (outcomeSelect) {
        outcomeSelect.innerHTML = '<option value="">Select Outcome</option>' +
            database.outcomes.map(o => `<option value="${o.id}">Outcome #${o.id}: ${o.description.substring(0, 50)}...</option>`).join('');
    }
}

function updateCandidateReliability(candidateId, rating, onTime) {
    const candidate = database.users.find(u => u.id === candidateId);
    if (!candidate) return;
    
    // Calculate new reliability
    const ratingScore = rating / 5;
    const timeScore = onTime ? 1 : 0.5;
    const newReliability = (ratingScore * 0.7 + timeScore * 0.3);
    
    // Update with smoothing
    candidate.reliability = candidate.reliability 
        ? (candidate.reliability * 0.7 + newReliability * 0.3)
        : newReliability;
    
    localStorage.setItem('taskverse_users', JSON.stringify(database.users));
}

// Make database available globally
window.taskverseDB = initializeDatabase();
// Enhanced database functionality
class TaskverseDatabase {
    constructor() {
        this.loadFromStorage();
        this.setupIndexedDB();
    }
    
    loadFromStorage() {
        this.users = JSON.parse(localStorage.getItem('taskverse_users')) || this.getDefaultUsers();
        this.outcomes = JSON.parse(localStorage.getItem('taskverse_outcomes')) || this.getDefaultOutcomes();
        this.matches = JSON.parse(localStorage.getItem('taskverse_matches')) || [];
        this.feedback = JSON.parse(localStorage.getItem('taskverse_feedback')) || [];
    }
    
    getDefaultUsers() {
        return [
            {
                id: 1,
                name: "Alex Chen",
                role: "candidate",
                github: "https://github.com/alexchen",
                skills: { "React": 0.95, "Node.js": 0.88, "Python": 0.92, "MongoDB": 0.85 },
                reliability: 0.94,
                proofScore: 0.91,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Sarah Johnson",
                role: "candidate",
                github: "https://github.com/sarahj",
                skills: { "React": 0.88, "TypeScript": 0.95, "AWS": 0.82, "GraphQL": 0.90 },
                reliability: 0.88,
                proofScore: 0.87,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "TechCorp Inc.",
                role: "employer",
                github: "",
                skills: {},
                reliability: 0,
                proofScore: 0,
                createdAt: new Date().toISOString()
            }
        ];
    }
    
    getDefaultOutcomes() {
        return [
            {
                id: 1,
                employer_id: 3,
                description: "Build a responsive dashboard with real-time analytics and interactive charts. Should include user management and data export functionality.",
                required_skills: ["React", "Chart.js", "Node.js", "JWT"],
                tasks: ["Create dashboard layout", "Implement charts", "Add user authentication", "Build data export feature"],
                complexity: 0.8,
                deadline: "2024-03-15",
                status: "open",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                employer_id: 3,
                description: "Develop a machine learning model for sentiment analysis on customer reviews with accuracy above 90%.",
                required_skills: ["Python", "TensorFlow", "NLP", "Pandas"],
                tasks: ["Data preprocessing", "Model training", "Accuracy testing", "Deployment script"],
                complexity: 0.9,
                deadline: "2024-04-01",
                status: "open",
                createdAt: new Date().toISOString()
            }
        ];
    }
    
    saveToStorage() {
        localStorage.setItem('taskverse_users', JSON.stringify(this.users));
        localStorage.setItem('taskverse_outcomes', JSON.stringify(this.outcomes));
        localStorage.setItem('taskverse_matches', JSON.stringify(this.matches));
        localStorage.setItem('taskverse_feedback', JSON.stringify(this.feedback));
    }
    
    addUser(user) {
        user.id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        user.createdAt = new Date().toISOString();
        this.users.push(user);
        this.saveToStorage();
        return user;
    }
    
    addOutcome(outcome) {
        outcome.id = this.outcomes.length > 0 ? Math.max(...this.outcomes.map(o => o.id)) + 1 : 1;
        outcome.createdAt = new Date().toISOString();
        outcome.status = outcome.status || "open";
        this.outcomes.push(outcome);
        this.saveToStorage();
        return outcome;
    }
    
    addMatch(match) {
        this.matches.push(match);
        this.saveToStorage();
        return match;
    }
    
    addFeedback(feedback) {
        this.feedback.push(feedback);
        this.saveToStorage();
        return feedback;
    }
    
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    
    getCandidateUsers() {
        return this.users.filter(user => user.role === 'candidate');
    }
    
    getEmployerUsers() {
        return this.users.filter(user => user.role === 'employer');
    }
    
    getOpenOutcomes() {
        return this.outcomes.filter(outcome => outcome.status === 'open');
    }
    
    getMatchesForOutcome(outcomeId) {
        return this.matches.filter(match => match.outcome_id === outcomeId);
    }
    
    getFeedbackForCandidate(candidateId) {
        return this.feedback.filter(fb => fb.candidate_id === candidateId);
    }
    
    updateUserReliability(candidateId, rating, onTime) {
        const user = this.getUserById(candidateId);
        if (!user) return null;
        
        const ratingScore = rating / 5;
        const timeScore = onTime ? 1 : 0.5;
        const newReliability = (ratingScore * 0.7 + timeScore * 0.3);
        
        user.reliability = user.reliability 
            ? (user.reliability * 0.7 + newReliability * 0.3)
            : newReliability;
        
        this.saveToStorage();
        return user.reliability;
    }
    
    allocateOutcome(outcomeId, candidateId) {
        const outcome = this.outcomes.find(o => o.id === outcomeId);
        if (outcome) {
            outcome.status = "allocated";
            outcome.allocated_to = candidateId;
            outcome.allocated_at = new Date().toISOString();
            
            // Remove matches for this outcome
            this.matches = this.matches.filter(m => m.outcome_id !== outcomeId);
            
            this.saveToStorage();
        }
    }
    
    calculateFitScore(candidate, outcome) {
        const skillMatch = this.calculateSkillMatch(candidate.skills, outcome.required_skills);
        const proofScore = candidate.proofScore || 0.8;
        const reliability = candidate.reliability || 0.9;
        
        return skillMatch * 0.5 + proofScore * 0.3 + reliability * 0.2;
    }
    
    calculateSkillMatch(candidateSkills, requiredSkills) {
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
    
    generateMatchesForOutcome(outcomeId) {
        const outcome = this.outcomes.find(o => o.id === outcomeId);
        if (!outcome) return [];
        
        const candidates = this.getCandidateUsers();
        const newMatches = [];
        
        candidates.forEach(candidate => {
            const fitScore = this.calculateFitScore(candidate, outcome);
            
            if (fitScore > 0.6) {
                const existingMatch = this.matches.find(
                    m => m.candidate_id === candidate.id && m.outcome_id === outcomeId
                );
                
                if (!existingMatch) {
                    const match = {
                        candidate_id: candidate.id,
                        outcome_id: outcomeId,
                        fit_score: fitScore,
                        generated_at: new Date().toISOString()
                    };
                    
                    this.addMatch(match);
                    newMatches.push(match);
                }
            }
        });
        
        return newMatches;
    }
    
    setupIndexedDB() {
        // Optional: Setup IndexedDB for larger datasets
        if (!window.indexedDB) {
            console.warn("IndexedDB not supported, using localStorage only");
            return;
        }
        
        // This would be expanded for production use
    }
}

// Export for use in other files
window.TaskverseDB = new TaskverseDatabase();
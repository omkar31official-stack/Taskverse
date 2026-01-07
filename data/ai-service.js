// Mock AI service for TASKVERSE
class AIService {
    constructor() {
        this.apiBase = 'https://api.taskverse.ai'; // Mock URL
    }
    
    async analyzeOutcome(description) {
        // Simulate API call
        await this.delay(1000);
        
        return {
            success: true,
            data: {
                skills: this.extractSkills(description),
                tasks: this.extractTasks(description),
                complexity: this.calculateComplexity(description),
                estimated_hours: this.estimateHours(description)
            }
        };
    }
    
    async calculateFitScore(outcome, candidate) {
        // Simulate AI calculation
        await this.delay(800);
        
        const skillMatch = this.calculateSkillMatch(candidate.skills, outcome.required_skills);
        const proofScore = candidate.proofScore || 0.8;
        const reliability = candidate.reliability || 0.9;
        
        const fitScore = skillMatch * 0.5 + proofScore * 0.3 + reliability * 0.2;
        
        return {
            success: true,
            data: {
                fit_score: fitScore,
                breakdown: {
                    skill_match: skillMatch,
                    proof_score: proofScore,
                    reliability: reliability
                },
                explanation: this.generateExplanation(skillMatch, proofScore, reliability)
            }
        };
    }
    
    async analyzeGitHubProfile(githubUrl) {
        // Simulate GitHub analysis
        await this.delay(1500);
        
        return {
            success: true,
            data: {
                activity_score: Math.random() * 0.3 + 0.7, // 0.7-1.0
                repo_quality: Math.random() * 0.4 + 0.6, // 0.6-1.0
                skill_verification: this.extractSkillsFromGitHub(),
                contribution_history: Math.random() * 0.5 + 0.5 // 0.5-1.0
            }
        };
    }
    
    extractSkills(description) {
        const skills = [];
        const text = description.toLowerCase();
        
        const skillMap = {
            'react': 'React',
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'node': 'Node.js',
            'python': 'Python',
            'java': 'Java',
            'c#': 'C#',
            'php': 'PHP',
            'ruby': 'Ruby',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'html': 'HTML/CSS',
            'css': 'HTML/CSS',
            'mongodb': 'MongoDB',
            'postgresql': 'PostgreSQL',
            'mysql': 'MySQL',
            'sql': 'SQL',
            'aws': 'AWS',
            'azure': 'Azure',
            'gcp': 'Google Cloud',
            'docker': 'Docker',
            'kubernetes': 'Kubernetes',
            'terraform': 'Terraform',
            'jenkins': 'Jenkins',
            'git': 'Git',
            'rest': 'REST API',
            'graphql': 'GraphQL',
            'jwt': 'JWT',
            'oauth': 'OAuth',
            'redux': 'Redux',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'express': 'Express.js',
            'django': 'Django',
            'flask': 'Flask',
            'spring': 'Spring Boot',
            'laravel': 'Laravel',
            'rails': 'Ruby on Rails',
            'machine learning': 'Machine Learning',
            'ml': 'Machine Learning',
            'ai': 'AI',
            'tensorflow': 'TensorFlow',
            'pytorch': 'PyTorch',
            'nlp': 'NLP',
            'computer vision': 'Computer Vision'
        };
        
        for (const [keyword, skill] of Object.entries(skillMap)) {
            if (text.includes(keyword)) {
                skills.push(skill);
            }
        }
        
        // Remove duplicates
        return [...new Set(skills)];
    }
    
    extractTasks(description) {
        const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return sentences.slice(0, 4).map(s => s.trim());
    }
    
    calculateComplexity(description) {
        let score = 0.5;
        const wordCount = description.split(/\s+/).length;
        
        // More words = more complex
        if (wordCount > 100) score += 0.2;
        if (wordCount > 200) score += 0.1;
        
        // Technical terms increase complexity
        const technicalTerms = ['integrate', 'implement', 'develop', 'build', 'create', 'design', 'architect'];
        technicalTerms.forEach(term => {
            if (description.toLowerCase().includes(term)) score += 0.05;
        });
        
        // Cap at 0.95
        return Math.min(score, 0.95);
    }
    
    estimateHours(description) {
        const wordCount = description.split(/\s+/).length;
        return Math.max(8, Math.floor(wordCount / 10) * 8); // Rough estimate
    }
    
    calculateSkillMatch(candidateSkills, requiredSkills) {
        if (!candidateSkills || !requiredSkills || requiredSkills.length === 0) return 0;
        
        let matchSum = 0;
        let matchedSkills = 0;
        
        requiredSkills.forEach(skill => {
            if (candidateSkills[skill]) {
                matchSum += candidateSkills[skill];
                matchedSkills++;
            }
        });
        
        return matchedSkills > 0 ? matchSum / requiredSkills.length : 0;
    }
    
    extractSkillsFromGitHub() {
        // Mock skill extraction
        const allSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Vue.js', 'Django', 'Flask', 'MongoDB', 'PostgreSQL'];
        const numSkills = Math.floor(Math.random() * 4) + 3; // 3-6 skills
        const skills = {};
        
        for (let i = 0; i < numSkills; i++) {
            const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
            if (!skills[skill]) {
                skills[skill] = Math.random() * 0.3 + 0.7; // 0.7-1.0 confidence
            }
        }
        
        return skills;
    }
    
    generateExplanation(skillMatch, proofScore, reliability) {
        const explanations = [];
        
        if (skillMatch > 0.8) {
            explanations.push("Excellent skill match for required technologies");
        } else if (skillMatch > 0.6) {
            explanations.push("Good skill alignment with some gaps");
        } else {
            explanations.push("Limited skill match for this outcome");
        }
        
        if (proofScore > 0.8) {
            explanations.push("Strong proof of capability demonstrated");
        } else if (proofScore > 0.6) {
            explanations.push("Adequate proof provided");
        } else {
            explanations.push("Limited proof of skill available");
        }
        
        if (reliability > 0.9) {
            explanations.push("Exceptional reliability history");
        } else if (reliability > 0.7) {
            explanations.push("Good reliability track record");
        } else {
            explanations.push("Limited reliability data available");
        }
        
        return explanations.join('. ') + '.';
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use
window.AIService = new AIService();
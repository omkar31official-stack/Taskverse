// Utility functions for TASKVERSE
const Utils = {
    // Format date
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    // Format date with time
    formatDateTime: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Calculate days remaining
    daysRemaining: function(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },
    
    // Get status color based on days remaining
    getDeadlineColor: function(days) {
        if (days < 0) return 'var(--danger)';
        if (days < 3) return 'var(--warning)';
        if (days < 7) return 'var(--primary)';
        return 'var(--success)';
    },
    
    // Format fit score as percentage
    formatScore: function(score) {
        return (score * 100).toFixed(1) + '%';
    },
    
    // Get score color
    getScoreColor: function(score) {
        if (score >= 0.9) return 'var(--success)';
        if (score >= 0.7) return 'var(--primary)';
        if (score >= 0.5) return 'var(--warning)';
        return 'var(--danger)';
    },
    
    // Generate a unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Validate URL
    isValidUrl: function(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },
    
    // Validate GitHub URL
    isValidGitHubUrl: function(url) {
        return this.isValidUrl(url) && url.includes('github.com');
    },
    
    // Truncate text with ellipsis
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // Calculate average rating
    calculateAverageRating: function(feedbackArray) {
        if (!feedbackArray || feedbackArray.length === 0) return 0;
        const sum = feedbackArray.reduce((acc, fb) => acc + fb.rating, 0);
        return sum / feedbackArray.length;
    },
    
    // Create skill badges HTML
    createSkillBadges: function(skills, limit = 5) {
        if (!skills) return '';
        
        const skillArray = typeof skills === 'object' ? Object.keys(skills) : skills;
        const displaySkills = skillArray.slice(0, limit);
        
        let html = '';
        displaySkills.forEach(skill => {
            const confidence = typeof skills === 'object' ? skills[skill] : 1;
            const color = this.getScoreColor(confidence);
            html += `<span class="skill-badge" style="border-left-color: ${color}">${skill}</span>`;
        });
        
        if (skillArray.length > limit) {
            html += `<span class="skill-badge">+${skillArray.length - limit} more</span>`;
        }
        
        return html;
    },
    
    // Create progress bar HTML
    createProgressBar: function(value, max = 1, color = null) {
        const percentage = (value / max) * 100;
        const barColor = color || this.getScoreColor(value / max);
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%; background-color: ${barColor};"></div>
                <span class="progress-text">${this.formatScore(value / max)}</span>
            </div>
        `;
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid var(--primary);
                }
                
                .notification-success {
                    border-left-color: var(--success);
                }
                
                .notification-error {
                    border-left-color: var(--danger);
                }
                
                .notification-warning {
                    border-left-color: var(--warning);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--gray);
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
};

// Add CSS for skill badges and progress bars
const utilityStyles = document.createElement('style');
utilityStyles.textContent = `
    .skill-badge {
        display: inline-block;
        padding: 4px 12px;
        background: var(--light);
        border-radius: 4px;
        margin: 2px;
        font-size: 0.85rem;
        border-left: 3px solid var(--primary);
    }
    
    .progress-bar {
        height: 24px;
        background: var(--light);
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        margin: 5px 0;
    }
    
    .progress-fill {
        height: 100%;
        transition: width 0.5s ease;
    }
    
    .progress-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(utilityStyles);

// Export for use
window.TaskverseUtils = Utils;
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import NavBar from "../components/NavBar.vue";
</script>

<template>
    <NavBar />
    <div class="landing-container">
        <div class="hero-section">
            <div class="floating-shapes">
                <div class="shape"></div>
                <div class="shape"></div>
                <div class="shape"></div>
            </div>
            
            <h1 class="hero-title">Your Voice Matters</h1>
            <p class="hero-subtitle">
                Create polls, gather opinions, and make informed decisions together. 
                Join thousands of people sharing their thoughts and shaping discussions.
            </p>
            
            <div class="cta-buttons">
                <button class="cta-primary" @click="router.push('/signup')">Get Started Free</button>
                <button class="cta-secondary" @click="router.push('/login')">Sign In</button>
            </div>
            
            <div class="features-section">
                <h2 class="features-title">Why Choose Us?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3 class="feature-title">Easy Poll Creation</h3>
                        <p class="feature-description">
                            Create engaging polls in seconds with our intuitive interface. 
                            Add unlimited options and detailed descriptions.
                        </p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">🗳️</div>
                        <h3 class="feature-title">Fair Voting</h3>
                        <p class="feature-description">
                            Participate in polls created by others. Your opinion counts, 
                            and every vote helps shape the conversation.
                        </p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">📈</div>
                        <h3 class="feature-title">Real-time Results</h3>
                        <p class="feature-description">
                            Track poll performance instantly. See how opinions evolve 
                            and discover trending topics in your community.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="stats-section">
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">10K+</span>
                        <span class="stat-label">Active Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">50K+</span>
                        <span class="stat-label">Polls Created</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">500K+</span>
                        <span class="stat-label">Votes Cast</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.landing-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 70px);
    padding: 2rem;
    text-align: center;
    overflow: hidden;
}

.hero-section {
    background: white;
    padding: 4rem 3rem;
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 900px;
    width: 100%;
    animation: fadeInUp 0.8s ease-out;
    position: relative;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-title {
    font-size: 3.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    animation: slideIn 1s ease-out 0.2s backwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.hero-subtitle {
    font-size: 1.4rem;
    color: #666;
    margin-bottom: 2.5rem;
    line-height: 1.6;
    animation: slideIn 1s ease-out 0.4s backwards;
}

.cta-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeIn 1s ease-out 0.6s backwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.cta-primary,
.cta-secondary {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.cta-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.cta-primary:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.cta-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.features-section {
    margin-top: 3rem;
    padding-top: 3rem;
    border-top: 2px solid #f0f0f0;
    animation: fadeIn 1s ease-out 0.8s backwards;
}

.features-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2.5rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    transition: all 0.3s ease;
    animation: scaleIn 0.5s ease-out backwards;
}

.feature-card:nth-child(1) {
    animation-delay: 1s;
}

.feature-card:nth-child(2) {
    animation-delay: 1.2s;
}

.feature-card:nth-child(3) {
    animation-delay: 1.4s;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.feature-card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: inline-block;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.feature-card:hover .feature-icon {
    animation: spin 0.6s ease-in-out;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.feature-title {
    font-size: 1.3rem;
    color: #667eea;
    margin-bottom: 0.75rem;
    font-weight: 600;
}

.feature-description {
    color: #666;
    line-height: 1.6;
    font-size: 0.95rem;
}

.stats-section {
    margin-top: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
    border-radius: 20px;
    animation: fadeIn 1s ease-out 1.6s backwards;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #666;
    font-size: 1rem;
}

.floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: -1;
}

.shape {
    position: absolute;
    background: linear-gradient(135deg, #667eea30 0%, #764ba230 100%);
    border-radius: 50%;
    animation: float 6s infinite ease-in-out;
}

.shape:nth-child(1) {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
}

.shape:nth-child(2) {
    width: 60px;
    height: 60px;
    top: 60%;
    left: 80%;
    animation-delay: 2s;
}

.shape:nth-child(3) {
    width: 100px;
    height: 100px;
    top: 80%;
    left: 20%;
    animation-delay: 4s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .hero-section {
        padding: 3rem 2rem;
    }
    
    .cta-buttons {
        flex-direction: column;
    }
    
    .cta-primary,
    .cta-secondary {
        width: 100%;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
</style>
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard.jsx';

function LandingPage() {
  const features = [
    {
      icon: '✦',
      title: 'Describe Your Idea',
      description:
        'Tell NxtBuild what you want to create using simple natural language.',
    },
    {
      icon: '⚡',
      title: 'AI Generates Code',
      description:
        'Gemini AI turns your idea into a complete working web application.',
    },
    {
      icon: '◈',
      title: 'Live Preview',
      description:
        'See your generated application instantly and make changes with chat.',
    },
  ];

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-badge">AI POWERED WEB APP BUILDER</p>

          <h1 className="hero-title">
            Build your ideas
            <br />
            with <span>NxtBuild</span>
          </h1>

          <p className="hero-description">
            Describe what you want to build and let AI turn your
            idea into a working web application.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-primary-btn">
              Start Building
            </Link>

            <Link to="/login" className="hero-secondary-btn">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <p className="section-label">HOW IT WORKS</p>

          <h2>From idea to application</h2>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
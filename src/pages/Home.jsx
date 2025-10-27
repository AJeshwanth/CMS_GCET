import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegFileAlt, FaChartLine, FaBell, FaChartPie, FaLock, FaCheck } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  // Section animation
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  // Features animation
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const features = [
    { icon: <FaRegFileAlt />, title: 'Easy Submission', desc: 'File complaints with just a few clicks with our intuitive form.' },
    { icon: <FaChartLine />, title: 'Real-time Tracking', desc: 'Monitor your complaint status from submission to resolution.' },
    { icon: <FaBell />, title: 'Instant Notifications', desc: 'Get notified when your complaint status changes.' },
    { icon: <FaChartPie />, title: 'Analytics Dashboard', desc: 'View complaint trends and resolution statistics.' }
  ];

  const steps = [
    { icon: <FaLock />, text: 'Login using your college ID and password.' },
    { icon: <FaRegFileAlt />, text: 'File a complaint with a title and detailed description.' },
    { icon: <FaChartLine />, text: 'Track complaint status in real time.' },
    { icon: <FaCheck />, text: 'Resolved complaints move to history.' }
  ];

  return (
    <div className="home-container">
      
      {/* Rotating Background Glow */}
      <Motion.div 
        className="background-glow"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      />

      <div className="hero-section">
        <Motion.div className="content" variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="hero-title">Complaint Management System</h1>
          <p className="hero-description">
            Our platform helps students, faculty, and administrators seamlessly manage and resolve complaints.
            Login with your college credentials to get started.
          </p>

          <Motion.button 
            className="login-button"
            onClick={handleLogin}
            whileHover={{ scale: 1.1, boxShadow: '0px 0px 20px rgba(0,128,0,0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            Login Now
          </Motion.button>
        </Motion.div>

        {/* Features */}
        <Motion.div 
          className="features-grid" 
          initial="hidden" 
          animate="visible" 
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {features.map((feature, idx) => (
            <Motion.div 
              className="feature-card" 
              key={idx} 
              variants={featureVariants} 
              whileHover={{ scale: 1.08, boxShadow: '0px 10px 30px rgba(0,255,0,0.3)' }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.desc}</p>
            </Motion.div>
          ))}
        </Motion.div>

        {/* How it Works */}
        <Motion.div className="how-it-works" variants={sectionVariants} initial="hidden" animate="visible">
          <h2><FaLock /> How it Works</h2>
          <div className="steps">
            {steps.map((step, idx) => (
              <Motion.div
                key={idx}
                className="step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                {step.icon} <span>{step.text}</span>
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* About Section */}
        <Motion.div className="about-section" variants={sectionVariants} initial="hidden" animate="visible">
          <h2>💡 About the Project</h2>
          <p>
            The <strong>Complaint Management System</strong> is designed to <span className="highlight">digitize and streamline</span> how complaints are raised and resolved in colleges.  
            Students and faculty can quickly raise issues regarding <span className="highlight">infrastructure</span>, <span className="highlight">academics</span>, or <span className="highlight">administration</span>, while admins can manage and resolve them in an organized way.  
          </p>
          <p>
            With real-time tracking, instant notifications, and an analytics dashboard, this system ensures <span className="highlight">transparency</span>, <span className="highlight">efficiency</span>, and <span className="highlight">accountability</span>.
          </p>
        </Motion.div>
      </div>
    </div>
  );
}
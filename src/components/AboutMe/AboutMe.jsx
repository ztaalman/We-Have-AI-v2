import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import profilePic from '../../assets/profile.jpg'; // Import the image at top
import './AboutMe.css';


// Resume data
const resumeData = {
  name: "Zachary R Taalman",
  location: "Chicago, Illinois",
  contact: {
    email: "ztaalman@gmail.com",
    phone: "847-414-1682",
    linkedin: "linkedin.com/in/zachary-taalman/"
  },
  summary: "Results-driven professional with a proven track record of driving revenue growth, enhancing brand visibility, and boosting profitability in fast-paced, technology-driven environments. Skilled in leading high-performing teams, executing strategic business initiatives, and cultivating strong business partnerships. Passionate about leveraging innovation to deliver transformative results and exceed organizational goals.",
  experience: [
    {
      title: "Ansys Software Sales Manager",
      company: "Simutech Group",
      period: "2025-Present",
      location: "Remote / Chicago, IL",
      achievements: [
        "Leading sales strategies for Ansys engineering simulation software across the Midwest region.",
        "Developing and managing key account relationships to drive adoption of advanced simulation technologies.",
        "Collaborating with engineering teams to provide technical solutions for complex simulation challenges."
      ]
    },
    {
      title: "Sales Engineer",
      company: "Herrmann Ultrasonics",
      period: "2024-2025",
      location: "Bartlett, IL",
      achievements: [
        "Increased target industry revenue by 65% over prior fiscal year budget. Diversified business unit sales concentration to hedge economic headwinds.",
        "Achieved 204% of production line (machine) sales goal, presidents club, and won a golden golf ball for over $1M in a single purchase order.",
        "Generated customized artificial intelligence tools to drive business unit efficiency. Examples: customer ROI bot, pipeline prioritization matrix, etc.",
        "Fostered rep growth through expansion of technical knowledge base, implementing targeted solution strategies, and joint customer visits."
      ]
    },
    {
      title: "Regional Sales Manager",
      company: "Screening Eagle Technologies",
      period: "2022-2024",
      location: "Remote / Chicago, IL",
      achievements: [
        "Expanded clientele base by 32% through organic campaigns, strengthening channel relationships, and prioritizing customer satisfaction.",
        "Led a team that consistently exceeded, often doubling sales quotas; set ambitious, yet achievable targets for my excellence-oriented team.",
        "Negotiated and secured advantageous agreements with key channel partners and resellers. Established KPIs leading to a 15% partner sales increase.",
        "Spearheaded campaigns with marketing, product managers, and industry leaders – proactive trend forecasting, enhancing brand recognition.",
        "Conducted large seminars, convention booths, and tech sales talks pertaining to our suite of interconnected cloud workflow software."
      ]
    },
    {
      title: "Materials Quality Engineer (Model 3/Y, Tesla Energy, and Tesla Semi)",
      company: "Tesla, Inc.",
      period: "2018-2021",
      location: "Reno-Sparks, NV",
      achievements: [
        "Derived operational system improvements and scrap/cost savings, applying Lean Six Sigma, resulting in a 12% YoY reduction of overhead loss.",
        "Systematized quality control procedures that monitored incoming supply and prevented outbound defects. Recouped ~ $2.5m/yr. from this.",
        "Developed powerful SQL dashboards and UIs to aid in tracking QC statistics on drive-unit and battery module components.",
        "Maintained project management relationships with global cross-functional, internal and external teams to improve reliability and profit margins.",
        "Collaborated with product management to execute strategic business plans for cost-performance optimization saving $95M in EV production."
      ]
    },
    {
      title: "Materials & Process Engineer Intern (Military, Construction, Access, and Emergency Vehicles)",
      company: "Oshkosh Corporation",
      period: "2017",
      location: "Oshkosh, WI",
      achievements: [
        "Improved inter-organizational part quality and processes, via data analysis. Contributed to 6.8bn in 2017 revenue, 9% YoY growth.",
        "Participated in supply-chain engineering communication with distributors to resolve discrepancies and discuss mediation.",
        "Ensured ongoing conformance with company policy and training, as well as ITAR (military regulations) and ISO/ASTM standards."
      ]
    },
    {
      title: "Product R&D Intern (Concussion Prevention – NFL & Other Impact Sports)",
      company: "Iowa State University, Start-up Cohort",
      period: "2016-2017",
      location: "Ames, IA",
      achievements: [
        "Translated technical research into marketable product features, informing design choices, and contributing to the product's competitive edge.",
        "Leveraged academic partnerships to supplement product research, gaining access to specialized expertise and funding opportunities.",
        "Performed competitive analysis to pinpoint market needs, leading to targeted product development and innovation in material application."
      ]
    },
    {
      title: "Licensed Insurance Sales Manager",
      company: "Allstate",
      period: "2013-2016",
      location: "Evanston, IL",
      achievements: []
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Materials Engineering",
      details: "Minor in Sustainability • Iowa State University • Ames, IA • 2017"
    },
    {
      degree: "eDX Micromasters - Data Analytics",
      details: "Georgia Institute of Technology (Partnered) • 2021 – 2023"
    }
  ],
  skills: {
    software: [
      "ChatGPT/Gemini/Claude", "IDEs", "CLIs", "Salesforce", "Hubspot", "Salesloft",
      "Zoominfo", "Apollo.io", "n8n", "zapier automation", "Tableau", "Gong.io",
      "DataGrip", "MySQL Workbench", "Git/Github", "Microsoft Suite"
    ],
    platforms: [
      "MCP", "RAG Framework", "CUDA Toolkit", "Windows", "Linux", "macOS", "Android", "iOS",
      "AWS", "Azure", "GCP", "Oracle Database", "MongoDB", "Snowflake", "Databricks",
      "Apache Kafka", "Apache Spark", "Qlik Sense", "Power BI", "WS SageMaker",
      "Azure Machine Learning", "Google Cloud Vertex AI", "Docker", "Kubernetes",
      "Visual Studio Code", "Jupyter Notebooks"
    ],
    languages: [
      "MySQL", "PostgreSQL", "C", "Python", "Bash", "JavaScript", "HTML/CSS",
      "TypeScript", "SQL (general)", "NoSQL", "R", "Java", "Scala", "Go", "Julia"
    ],
    business: [
      "B2B Lead Generation", "Account Growth", "Technical Presentations", "Public Speaking",
      "Financial Statements (P&L)", "Deal Negotiation", "ARR Growth"
    ]
  },
  philanthropy: [
    "Quito Ecuador School Rebuild Project Contributor",
    "Habitat for Humanity",
    "Youth Discover STEM",
    "App, Web, and Program Development, Strongly Proficient with LLMs (ChatGPT and similar)",
    "Rebuilt a Tesla Model 3 in spare time."
  ]
};

const AboutMe = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('summary');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 3D effect tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSectionChange = (section) => {
    if (section !== activeSection && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSection(section);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Interactive timeline for experience
  const renderExperienceTimeline = () => {
    return (
      <div className="experience-timeline">
        {resumeData.experience.map((job, index) => (
          <motion.div
            key={index}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="timeline-content">
              <h3>{job.title}</h3>
              <h4>{job.company} | {job.period}</h4>
              <p className="location">{job.location}</p>
              <ul>
                {job.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Interactive skills visualization
  const renderSkills = () => {
    const categories = Object.keys(resumeData.skills);

    return (
      <div className="skills-wrapper">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            className="skill-category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.2 }}
          >
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className="skills-container">
              {resumeData.skills[category].map((skill, index) => (
                <motion.div
                  key={index}
                  className="skill-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Education cards
  const renderEducation = () => {
    return (
      <div className="education-container">
        {resumeData.education.map((edu, index) => (
          <motion.div
            key={index}
            className="education-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <h3>{edu.degree}</h3>
            <p>{edu.details}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  // Philanthropy visualization
  const renderPhilanthropy = () => {
    return (
      <div className="philanthropy-container">
        {resumeData.philanthropy.map((item, index) => (
          <motion.div
            key={index}
            className="philanthropy-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    );
  };

  // 3D card effect style
  const cardStyle = {
    transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${-mousePosition.y * 2}deg)`,
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className="about-me-container" ref={containerRef}>
      {/* Back Button */}
      <button className="return-button" onClick={() => onNavigate('hub')}>
        &lt; RETURN TO HUB
      </button>

      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={cardStyle}
      >
        <div className="profile-image-container">
          <div className="profile-image">
            <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="profile-info">
          <h1>{resumeData.name}</h1>
          <p className="location">{resumeData.location}</p>
          <div className="contact-info">
            <a href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a>
            <a href={`tel:${resumeData.contact.phone}`}>{resumeData.contact.phone}</a>
            <a href={`https://${resumeData.contact.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </motion.div>

      <div className="section-navigation">
        <button
          className={activeSection === 'summary' ? 'active' : ''}
          onClick={() => handleSectionChange('summary')}
        >
          Summary
        </button>
        <button
          className={activeSection === 'experience' ? 'active' : ''}
          onClick={() => handleSectionChange('experience')}
        >
          Experience
        </button>
        <button
          className={activeSection === 'skills' ? 'active' : ''}
          onClick={() => handleSectionChange('skills')}
        >
          Skills
        </button>
        <button
          className={activeSection === 'education' ? 'active' : ''}
          onClick={() => handleSectionChange('education')}
        >
          Education
        </button>
        <button
          className={activeSection === 'philanthropy' ? 'active' : ''}
          onClick={() => handleSectionChange('philanthropy')}
        >
          Philanthropy
        </button>
      </div>

      <motion.div
        className={`content-section ${isAnimating ? 'fade-out' : 'fade-in'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeSection === 'summary' && (
          <motion.div
            className="summary-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Professional Summary</h2>
            <p>{resumeData.summary}</p>
            <div className="summary-highlights">
              <motion.div
                className="highlight-card"
                whileHover={{ scale: 1.05 }}
              >
                <h3>Revenue Growth</h3>
                <p>Proven track record of driving significant revenue increases across multiple industries</p>
              </motion.div>
              <motion.div
                className="highlight-card"
                whileHover={{ scale: 1.05 }}
              >
                <h3>Technical Leadership</h3>
                <p>Combining engineering background with business acumen to lead technical teams</p>
              </motion.div>
              <motion.div
                className="highlight-card"
                whileHover={{ scale: 1.05 }}
              >
                <h3>AI Innovation</h3>
                <p>Leveraging cutting-edge AI tools to drive business efficiency and growth</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeSection === 'experience' && (
          <motion.div
            className="experience-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Professional Experience</h2>
            {renderExperienceTimeline()}
          </motion.div>
        )}

        {activeSection === 'skills' && (
          <motion.div
            className="skills-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Technical & Business Skills</h2>
            {renderSkills()}
          </motion.div>
        )}

        {activeSection === 'education' && (
          <motion.div
            className="education-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Education</h2>
            {renderEducation()}
          </motion.div>
        )}

        {activeSection === 'philanthropy' && (
          <motion.div
            className="philanthropy-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Philanthropy & Projects</h2>
            {renderPhilanthropy()}
          </motion.div>
        )}
      </motion.div>

      <div className="chat-suggestion">
        <p>Want to know more about Zachary? Ask our AI Chatbot about his experience, skills, or achievements!</p>
      </div>
    </div>
  );
};

export default AboutMe;
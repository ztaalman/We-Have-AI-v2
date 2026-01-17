// Routeway AI API with LLAMA 3.3-70b
// Includes DuckDuckGo search for internet access

// Workaround: Use a BRAND NEW variable name to bypass caching issues
const RAW_KEY = import.meta.env.VITE_CHAT_KEY || '';

// Remove any whitespace and "Bearer " prefix if accidentally pasted
const ROUTEWAY_API_KEY = RAW_KEY.replace(/^Bearer\s+/i, '').trim();

// Debug check
console.log('Loaded Key Start:', ROUTEWAY_API_KEY ? ROUTEWAY_API_KEY.substring(0, 10) + '...' : 'UNDEFINED');

if (ROUTEWAY_API_KEY.startsWith('AIzaSy')) {
  console.warn('WARNING: The loaded key STILL looks like a Google API key. Please check VITE_CHAT_KEY in .env');
}

const API_URL = 'https://api.routeway.ai/v1/chat/completions';

// Log key details for debugging (safe version)
// Key loaded successfully if no error in console

// Site-specific knowledge for the AI
// Site-specific knowledge for the AI
const SITE_CONTEXT = `
You are an AI assistant for Zach Taalman's portfolio website "zLab".

ABOUT ZACH TAALMAN:
- Name: Zachary R Taalman
- Location: Chicago, Illinois
- Contact: ztaalman@gmail.com | 847-414-1682 | linkedin.com/in/zachary-taalman/

PROFESSIONAL EXPERIENCE:
- Ansys Software Sales Manager at Simutech Group (2025-Present): Leading sales strategies for engineering simulation software.
- Sales Engineer at Herrmann Ultrasonics (2024-2025): Increased revenue by 65%, diversified sales, achieved 204% of machine sales goal. Uses AI tools for efficiency.
- Regional Sales Manager at Screening Eagle Technologies (2022-2024): Expanded clientele by 32%, led high-performing team.
- Materials Quality Engineer at Tesla, Inc. (2018-2021): Worked on Model 3/Y, Energy, Semi. Lean Six Sigma, SQL dashboards, cost savings ($95M).
- Internships at Oshkosh Corporation (2017) and Iowa State University (2016-2017).
- Licensed Insurance Sales Manager at Allstate (2013-2016).

EDUCATION:
- B.S. in Materials Engineering, Iowa State University (2017).
- eDX Micromasters - Data Analytics, Georgia Tech (2021-2023).

SKILLS:
- Software: ChatGPT/Gemini/Claude, Salesforce, Tableau, SQL, Git, Python, C, JavaScript, React.
- Platforms: AWS, Azure, GCP, Docker, Kubernetes.
- Business: B2B Lead Gen, Negotiation, Public Speaking.

PHILANTHROPY & INTERESTS:
- Quito Ecuador School Rebuild Project.
- Habitat for Humanity.
- Rebuilt a Tesla Model 3.
- Full-stack developer and AI enthusiast (React, Three.js).

ABOUT THIS WEBSITE (zLab):
- Features a 3D medieval castle environment built with React Three Fiber.
- Has interactive elements: knight character, clickable doors, torches.
- SECTIONS:
  - Hub: Main 3D scene (Castle).
  - About Me: Detailed resume and bio.
  - Chatbot: You!
  - Contact: 3D Contact card.
  - Tools & Games: Currently UNDER CONSTRUCTION (features a 3D Mole excavating new features).
- The "WE HAVE AI" stone logo represents the AI-powered features.

You can help users with:
- Information about Zach's professional experience (Tesla, Herrmann, etc.).
- Questions about the website features.
- General knowledge questions.
`;

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

// DuckDuckGo search function
async function searchDuckDuckGo(query) {
  try {
    // Use DuckDuckGo Instant Answer API
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`
    );

    if (!response.ok) return null;

    const data = await response.json();

    // Extract useful information
    const results = [];

    if (data.Abstract) {
      results.push(`Summary: ${data.Abstract}`);
    }

    if (data.Answer) {
      results.push(`Answer: ${data.Answer}`);
    }

    // Related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const topics = data.RelatedTopics
        .slice(0, 3)
        .filter(t => t.Text)
        .map(t => t.Text);
      if (topics.length > 0) {
        results.push(`Related info: ${topics.join(' | ')}`);
      }
    }

    return results.length > 0 ? results.join('\n') : null;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

// Detect if query needs internet search
function needsInternetSearch(query) {
  const searchIndicators = [
    'what is', 'who is', 'when', 'where', 'how to',
    'latest', 'current', 'news', 'today',
    'define', 'explain', 'tell me about',
    'search', 'look up', 'find'
  ];

  const lowerQuery = query.toLowerCase();
  return searchIndicators.some(indicator => lowerQuery.includes(indicator));
}

/**
 * Send a prompt to the Routeway AI API and get a response
 * @param {string} prompt - The text prompt to send to the API
 * @returns {Promise<string>} - The response text from the API
 */
export const getGeminiResponse = async (prompt, history = []) => {
  try {
    if (!ROUTEWAY_API_KEY) {
      console.error('Routeway API key is missing. Check your .env file.');
      return 'API key is missing. Please add VITE_CHAT_KEY to your .env file.';
    }

    // Rate limiting
    const now = Date.now();
    // Allow slightly faster conversation flow since context is larger
    if (now - lastRequestTime < 500) {
      // Silent wait or just proceed if < 1s
    }
    lastRequestTime = now;

    // Extract user query from prompt (legacy support) or just use prompt
    const userQueryMatch = prompt.match(/User query: (.*?)(\n|$)/);
    const userQuery = userQueryMatch ? userQueryMatch[1].trim() : prompt;

    // Check if we need to search the internet
    let searchContext = '';
    if (needsInternetSearch(userQuery)) {
      console.log('Searching the internet for:', userQuery);
      const searchResults = await searchDuckDuckGo(userQuery);
      if (searchResults) {
        searchContext = `\n\nINTERNET SEARCH RESULTS:\n${searchResults}\n\nUse these search results to help answer the question if relevant.`;
      }
    }

    // Format history for LLAMA
    // Limit to last 10 messages to save context window
    const formattedHistory = history.slice(-10).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Build messages array: System -> History -> Current User Query
    const messages = [
      {
        role: 'system',
        content: SITE_CONTEXT + searchContext
      },
      ...formattedHistory,
      {
        role: 'user',
        content: userQuery
      }
    ];

    console.log('Sending request to Routeway AI...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ROUTEWAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-instruct:free',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);

      if (response.status === 429) {
        return 'I\'ve reached my rate limit. Please try again in a moment.';
      } else if (response.status === 401) {
        return 'API authentication failed. Please check your API key.';
      }

      return `I encountered an error (${response.status}). Please try again.`;
    }

    const data = await response.json();
    console.log('Routeway AI response received');

    // Extract the response text
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }

    console.error('Unexpected response structure:', data);
    return 'I received an unexpected response. Please try again.';

  } catch (error) {
    console.error('Error in getGeminiResponse:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network error. Please check your internet connection.';
    }

    return 'I encountered an error processing your request. Please try again.';
  }
};

/**
 * Analyze a CAD model for 3D printing optimization
 * @param {Object} modelData - Data about the CAD model
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeCADModel = async (modelData) => {
  const { fileName, fileSize, dimensions, fileType } = modelData;

  const prompt = `
    Analyze this 3D model for 3D printing optimization:
    
    MODEL DETAILS:
    - Filename: ${fileName}
    - File size: ${fileSize}
    - Dimensions: ${dimensions.x}mm x ${dimensions.y}mm x ${dimensions.z}mm
    - File type: ${fileType}
    
    Please provide detailed advice on:
    1. Optimal print settings (layer height, infill, speed, supports)
    2. Potential issues with the geometry
    3. Material recommendations
    4. Best orientation for printing
    5. Optimization tips for better printability
  `;

  try {
    const response = await getGeminiResponse(prompt);

    return {
      analysis: response,
      timestamp: new Date().toISOString(),
      modelDetails: {
        fileName,
        fileSize,
        dimensions: `${dimensions.x}mm x ${dimensions.y}mm x ${dimensions.z}mm`,
        fileType
      }
    };
  } catch (error) {
    console.error('Error analyzing CAD model:', error);
    return {
      analysis: 'Unable to analyze the model at this time. Please try again later.',
      timestamp: new Date().toISOString(),
      modelDetails: {
        fileName,
        fileSize,
        dimensions: `${dimensions.x}mm x ${dimensions.y}mm x ${dimensions.z}mm`,
        fileType
      }
    };
  }
};
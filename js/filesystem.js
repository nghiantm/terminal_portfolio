const filesystem = {
  type: 'dir',
  children: {
    'projects': {
      type: 'dir',
      children: {
        'rtalk.md': {
          type: 'file',
          content: [
            '<br>',
            '<span class="command"># rTalk — AI Language Learning</span>',
            '<br>',
            'AI-powered conversation partner for language learners.',
            'Practice speaking naturally with real-time grammar feedback.',
            '<br>',
            '<span class="command">Stack</span>      React · Node.js · Express · OpenAI API',
            '<span class="command">Live</span>       <a href="https://r-talk.netlify.app" target="_blank">r-talk.netlify.app</a>',
            '<br>',
            '<span class="command">Highlights</span>',
            '  · Contextual corrections without interrupting conversation flow',
            '  · Supports 10+ languages via GPT-4 prompting',
            '  · Session history with progress tracking',
            '<br>',
          ]
        },
        'tradequest.md': {
          type: 'file',
          content: [
            '<br>',
            '<span class="command"># Trade Quest — Paper Trading Platform</span>',
            '<br>',
            'Risk-free stock trading simulator for beginner investors.',
            'Real market data, zero real money.',
            '<br>',
            '<span class="command">Stack</span>      React · Chart.js · Alpha Vantage API',
            '<span class="command">Live</span>       <a href="https://tradequest.netlify.app" target="_blank">tradequest.netlify.app</a>',
            '<br>',
            '<span class="command">Highlights</span>',
            '  · Real-time stock data with candlestick charts',
            '  · Virtual portfolio with P&L tracking',
            '  · Leaderboard across simulated portfolios',
            '<br>',
          ]
        },
        'studybuddy.md': {
          type: 'file',
          content: [
            '<br>',
            '<span class="command"># Study Buddy — AI Study Assistant</span>',
            '<br>',
            'Personal AI-powered study assistant for students.',
            'Turns lecture notes into actionable study material.',
            '<br>',
            '<span class="command">Stack</span>      React · Firebase · OpenAI API',
            '<span class="command">Live</span>       <a href="https://study-buddyy.netlify.app" target="_blank">study-buddyy.netlify.app</a>',
            '<br>',
            '<span class="command">Highlights</span>',
            '  · Automatic flashcard generation from notes',
            '  · Quiz mode with spaced repetition scheduling',
            '  · Progress analytics dashboard',
            '<br>',
          ]
        },
        'movie-recommender.md': {
          type: 'file',
          content: [
            '<br>',
            '<span class="command"># Movie Recommender — Collaborative Filtering</span>',
            '<br>',
            'Personalized movie recommendations using ML algorithms.',
            'Hybrid model combining collaborative and content-based filtering.',
            '<br>',
            '<span class="command">Stack</span>      Python · Pandas · Scikit-learn · Flask',
            '<span class="command">Repo</span>       <a href="https://github.com/nghiantm/movie-rec" target="_blank">github.com/nghiantm/movie-rec</a>',
            '<br>',
            '<span class="command">Highlights</span>',
            '  · Collaborative filtering on 100k+ MovieLens ratings',
            '  · Cosine similarity for content-based matching',
            '  · REST API via Flask for frontend integration',
            '<br>',
          ]
        },
      }
    },
    'aboutme.txt': {
      type: 'file',
      content: [
        '<br>',
        '<span class="command">MATT NGUYEN</span>',
        'mn839@drexel.edu · linkedin.com/in/nghiantm · github.com/nghiantm',
        '<br>',
        '<span class="command">EDUCATION</span>',
        '  Drexel University — B.S. Computer Science, 2024–2027',
        '<br>',
        '<span class="command">PROJECTS</span>',
        '  rTalk, Trade Quest, Study Buddy, Movie Recommender',
        '  → ls projects/ to browse · cat projects/&lt;name&gt;.md for details',
        '<br>',
      ]
    },
  }
};

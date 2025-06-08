// News API service for fetching real medical and health news
const API_KEY = "f9a7c81b434e44fe8ed32c1ae7628cf7";
const BASE_URL = "https://newsapi.org/v2";

export const fetchNews = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=medical%20OR%20health%20OR%20disease%20OR%20treatment&language=en&sortBy=popularity&apiKey=${API_KEY}`,
      {
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      const jsonData = await response.json();
      const articles = jsonData.articles;

      return articles.map((article, index) => ({
        id: `news-${index}`,
        title: article.title || '',
        excerpt: article.description || '',
        content: article.content || '',
        url: article.url || '',
        image: article.urlToImage || '',
        date: article.publishedAt || '',
        source: article.source?.name || 'Unknown Source',
        author: {
          name: article.author || article.source?.name || 'Unknown Author',
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
          role: 'Medical Correspondent'
        },
        category: categorizeArticle(article.title, article.description),
        stats: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 50)
        },
        featured: index === 0 // Make first article featured
      }));
    } else {
      throw new Error(`Failed to load news: ${response.status}`);
    }
  } catch (e) {
    console.error('Error loading news:', e);
    throw new Error(`Error occurred while loading news: ${e.message}`);
  }
};

// Helper function to categorize articles based on content
const categorizeArticle = (title, description) => {
  const content = `${title} ${description}`.toLowerCase();
  
  if (content.includes('research') || content.includes('study') || content.includes('clinical trial')) {
    return 'research';
  } else if (content.includes('treatment') || content.includes('therapy') || content.includes('drug')) {
    return 'treatments';
  } else if (content.includes('technology') || content.includes('ai') || content.includes('digital')) {
    return 'technology';
  } else if (content.includes('event') || content.includes('conference') || content.includes('summit')) {
    return 'events';
  } else if (content.includes('company') || content.includes('announcement') || content.includes('launch')) {
    return 'company';
  } else {
    return 'research'; // Default category
  }
};

import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, ArrowUpRight, Heart, MessageSquare, Share2, BookmarkPlus, RefreshCw, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { fetchNews } from '../api/users/newsAPI';

const CATEGORIES = [
  { id: 'all', name: 'All News' },
  { id: 'research', name: 'Research' },
  { id: 'treatments', name: 'Treatments' },
  { id: 'technology', name: 'Technology' },
  { id: 'events', name: 'Events' },
  { id: 'company', name: 'Company' }
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load news from API
  const loadNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const articles = await fetchNews();
      setNewsItems(articles);
      setFilteredNews(articles);
    } catch (err) {
      setError(err.message);
      setNewsItems([]);
      setFilteredNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);
  
  useEffect(() => {
    // Filter news based on search query and selected category
    const filtered = newsItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory, newsItems]);
    // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Health News & Updates</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Stay informed about the latest in medical research, health breakthroughs, and treatment advances.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadNews}
            disabled={isLoading}
            className="flex items-center shrink-0"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
        {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <div className="p-6 text-center">
            <p className="text-red-800 dark:text-red-400 mb-4">
              Failed to load news: {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadNews}
            >
              Try Again
            </Button>
          </div>
        </Card>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-6">
                <div className="animate-pulse">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                  </div>
                  <div className="mb-3 h-6 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-5 space-y-2">
                    <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                      <div className="ml-2 h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    </div>
                    <div className="h-8 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                  </div>
                </div>
              </div>
            </Card>          ))}
        </div>
      )}

      {/* Search and Filters */}
      {!isLoading && !error && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`mr-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none
                  ${selectedCategory === category.id 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
        {/* Featured News */}
      {!isLoading && !error && filteredNews.some(item => item.featured) && (
        <div className="mb-12">
          {filteredNews
            .filter(item => item.featured)
            .map(featuredItem => (
              <Card key={featuredItem.id} className="overflow-hidden shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative">
                    {featuredItem.image ? (
                      <img
                        src={featuredItem.image}
                        alt={featuredItem.title}
                        className="h-full w-full object-cover"
                        style={{ minHeight: '320px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                      style={{ 
                        minHeight: '320px',
                        display: featuredItem.image ? 'none' : 'flex'
                      }}
                    >
                      <div className="text-center">
                        <Heart className="mx-auto mb-3 h-16 w-16" />
                        <p className="text-xl font-semibold">Health News</p>
                      </div>
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-8">
                    <div>
                      <div className="mb-6 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{formatDate(featuredItem.date)}</span>
                        </div>
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {featuredItem.category}
                        </span>
                      </div>
                      <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                        {featuredItem.title}
                      </h2>
                      <p className="mb-6 text-neutral-600 dark:text-neutral-400 line-clamp-3 text-base leading-relaxed">
                        {featuredItem.excerpt}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Source: {featuredItem.source}
                      </p>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          src={featuredItem.author.avatar}
                          alt={featuredItem.author.name}
                          fallback={featuredItem.author.name[0]}
                          className="h-10 w-10"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {featuredItem.author.name}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {featuredItem.author.role}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        className="flex items-center"
                        onClick={() => window.open(featuredItem.url, '_blank')}
                      >
                        Read Article
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}      
      {/* News Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews
            .filter(item => !item.featured)
            .map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Article Image */}
                {item.image && (
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium capitalize text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {item.category}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  
                  <h3 className="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                  
                  <div className="mb-6 text-xs text-neutral-500 dark:text-neutral-400">
                    Source: {item.source}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <Avatar
                        src={item.author.avatar}
                        alt={item.author.name}
                        fallback={item.author.name[0]}
                        className="h-8 w-8 shrink-0"
                      />
                      <span className="ml-3 text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {item.author.name}
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                      className="flex items-center shrink-0 ml-2"
                    >
                      Read <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-xs text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors">
                          <Heart className="mr-1 h-4 w-4" /> {item.stats.likes}
                        </button>
                        <button className="flex items-center text-xs text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors">
                          <MessageSquare className="mr-1 h-4 w-4" /> {item.stats.comments}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="rounded-full p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: item.title,
                                url: item.url
                              });
                            } else {
                              navigator.clipboard.writeText(item.url);
                            }
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="rounded-full p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors">
                          <BookmarkPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}      
      {/* No Results */}
      {!isLoading && !error && filteredNews.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mb-4 rounded-full bg-neutral-200 p-4 dark:bg-neutral-700">
            <Search className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
          </div>
          <p className="mb-2 text-xl font-medium text-neutral-900 dark:text-neutral-100">No news found</p>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            No news articles match your current search criteria. Try adjusting your filters or search terms.
          </p>
        </div>
      )}
      
      {/* Newsletter Subscription */}
      {!isLoading && (
        <Card className="mt-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 border-primary-200 dark:border-primary-800">
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 rounded-full bg-primary-100 p-3 dark:bg-primary-900/30">
              <Heart className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Subscribe to Health News Updates
            </h3>
            <p className="mb-8 max-w-lg text-neutral-600 dark:text-neutral-400 text-lg">
              Stay updated with the latest medical news, research findings, and health tips delivered straight to your inbox.
            </p>
            <div className="flex w-full max-w-md flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow"
              />
              <Button className="px-8">
                Subscribe
              </Button>
            </div>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              By subscribing, you agree to our Privacy Policy and consent to receive health updates.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default News;
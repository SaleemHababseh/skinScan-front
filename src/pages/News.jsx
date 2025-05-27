import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, ArrowUpRight, Heart, MessageSquare, Share2, BookmarkPlus } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

const CATEGORIES = [
  { id: 'all', name: 'All News' },
  { id: 'research', name: 'Research' },
  { id: 'treatments', name: 'Treatments' },
  { id: 'technology', name: 'Technology' },
  { id: 'events', name: 'Events' },
  { id: 'company', name: 'Company' }
];

// Mock news data
const NEWS_ITEMS = [
  {
    id: 1,
    title: 'New AI Model Improves Skin Cancer Detection Accuracy by 30%',
    excerpt: 'Researchers have developed a new deep learning model that significantly improves early detection rates for melanoma and other types of skin cancer.',
    category: 'research',
    image: 'https://images.unsplash.com/photo-1581093196277-9f6070b80902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2025-04-15',
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      role: 'Research Lead'
    },
    stats: {
      likes: 42,
      comments: 8,
      shares: 15
    },
    featured: true
  },
  {
    id: 2,
    title: 'SkinScan App Now Available in 10 More Countries',
    excerpt: 'Our app has expanded its reach to 10 additional countries, making advanced skin health monitoring available to millions more people worldwide.',
    category: 'company',
    date: '2025-04-10',
    author: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      role: 'Global Expansion Director'
    },
    stats: {
      likes: 31,
      comments: 5,
      shares: 22
    }
  },
  {
    id: 3,
    title: 'Advanced Treatment for Psoriasis Shows Promising Results in Clinical Trials',
    excerpt: 'A new biological treatment for severe psoriasis has shown an 85% improvement rate in phase III clinical trials, offering hope for patients with this condition.',
    category: 'treatments',
    date: '2025-04-08',
    author: {
      name: 'Dr. Anita Patel',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      role: 'Dermatology Specialist'
    },
    stats: {
      likes: 56,
      comments: 14,
      shares: 19
    }
  },
  {
    id: 4,
    title: 'Virtual Reality Used for Dermatology Training Shows Great Results',
    excerpt: 'Medical schools are now incorporating VR technology to train future dermatologists, allowing them to practice diagnosis on thousands of virtual cases.',
    category: 'technology',
    date: '2025-04-05',
    author: {
      name: 'Prof. James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      role: 'Medical Education Director'
    },
    stats: {
      likes: 28,
      comments: 6,
      shares: 11
    }
  },
  {
    id: 5,
    title: 'Annual Skin Health Awareness Week Starts Next Month',
    excerpt: 'Mark your calendars for the Annual Skin Health Awareness Week starting May 15th, featuring free screenings, webinars, and educational resources.',
    category: 'events',
    date: '2025-04-01',
    author: {
      name: 'Lisa Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
      role: 'Community Outreach Coordinator'
    },
    stats: {
      likes: 19,
      comments: 3,
      shares: 27
    }
  },
  {
    id: 6,
    title: 'New Wearable Device Monitors Sun Exposure in Real-Time',
    excerpt: 'A revolutionary new wearable device can track UV exposure and alert users when they need to apply sunscreen or seek shade.',
    category: 'technology',
    date: '2025-03-28',
    author: {
      name: 'Dr. Thomas Lee',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'Product Innovation Lead'
    },
    stats: {
      likes: 37,
      comments: 9,
      shares: 14
    }
  }
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNews, setFilteredNews] = useState(NEWS_ITEMS);
  
  useEffect(() => {
    // Filter news based on search query and selected category
    const filtered = NEWS_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory]);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">News & Updates</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Stay informed about the latest in skin health, research breakthroughs, and company updates.
        </p>
      </div>
      
      {/* Search and Filters */}
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
        
        <div className="flex overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`mr-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium focus:outline-none
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
      
      {/* Featured News */}
      {filteredNews.some(item => item.featured) && (
        <div className="mb-8">
          {filteredNews
            .filter(item => item.featured)
            .map(featuredItem => (
              <Card key={featuredItem.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div 
                    className="aspect-w-16 aspect-h-9 md:aspect-none md:h-full" 
                    style={{
                      backgroundImage: `url(${featuredItem.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '300px'
                    }}
                  >
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <div className="mb-4 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{formatDate(featuredItem.date)}</span>
                      </div>
                      <h2 className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {featuredItem.title}
                      </h2>
                      <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                        {featuredItem.excerpt}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          src={featuredItem.author.avatar}
                          alt={featuredItem.author.name}
                          fallback={featuredItem.author.name[0]}
                          className="h-8 w-8"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {featuredItem.author.name}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {featuredItem.author.role}
                          </p>
                        </div>
                      </div>
                      
                      <Button className="flex items-center">
                        Read Article
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
      
      {/* News Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNews
          .filter(item => !item.featured)
          .map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(item.date)}
                  </span>
                </div>
                
                <h3 className="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>
                
                <p className="mb-5 text-sm text-neutral-600 dark:text-neutral-400">
                  {item.excerpt}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar
                      src={item.author.avatar}
                      alt={item.author.name}
                      fallback={item.author.name[0]}
                      className="h-7 w-7"
                    />
                    <span className="ml-2 text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      {item.author.name}
                    </span>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    Read More <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-xs text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                        <Heart className="mr-1 h-4 w-4" /> {item.stats.likes}
                      </button>
                      <button className="flex items-center text-xs text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                        <MessageSquare className="mr-1 h-4 w-4" /> {item.stats.comments}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="rounded-full p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-full p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400">
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
      
      {/* No Results */}
      {filteredNews.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <p className="mb-2 text-lg font-medium text-neutral-900 dark:text-neutral-100">No news found</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No news articles match your current search criteria. Try adjusting your filters.
          </p>
        </div>
      )}
      
      {/* Newsletter Subscription */}
      <Card className="mt-10">
        <div className="flex flex-col items-center p-8 text-center">
          <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Subscribe to Our Newsletter
          </h3>
          <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
            Stay updated with the latest news, research findings, and tips for maintaining healthy skin.
          </p>
          <div className="flex w-full max-w-md flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button>
              Subscribe
            </Button>
          </div>
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default News;
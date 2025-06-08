
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';

const blogPosts = [
  {
    id: '1',
    title: 'The Importance of Daily Torah Study',
    excerpt: 'Discover how incorporating Torah study into your daily routine can transform your spiritual journey and deepen your connection to Jewish wisdom.',
    author: 'Rabbi David Cohen',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Spirituality',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Modern Challenges in Traditional Learning',
    excerpt: 'Exploring how technology and modern life present both opportunities and challenges for traditional Jewish learning methods.',
    author: 'Sarah Goldstein',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Education',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Building a Jewish Home in the Digital Age',
    excerpt: 'Practical tips for maintaining Jewish values and traditions while navigating the complexities of modern technology.',
    author: 'Rabbi Michael Levy',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Family',
    image: '/placeholder.svg'
  }
];

const Blog = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Torah Learning Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, teachings, and perspectives on Torah study and Jewish life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Blog;

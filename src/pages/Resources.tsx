
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink, Search, FileText, Video, Headphones, Book, Link } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  resource_type: string;
  file_url: string;
  external_url: string;
  author: string;
  tags: string[];
  is_featured: boolean;
  download_count: number;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('title');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      // Update download count
      await supabase
        .from('resources')
        .update({ download_count: resource.download_count + 1 })
        .eq('id', resource.id);

      // Open file or external link
      if (resource.file_url) {
        window.open(resource.file_url, '_blank');
      } else if (resource.external_url) {
        window.open(resource.external_url, '_blank');
      }

      // Update local state
      setResources(prev => prev.map(r => 
        r.id === resource.id 
          ? { ...r, download_count: r.download_count + 1 }
          : r
      ));
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-6 w-6" />;
      case 'video': return <Video className="h-6 w-6" />;
      case 'audio': return <Headphones className="h-6 w-6" />;
      case 'book': return <Book className="h-6 w-6" />;
      case 'link': return <Link className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(resources.map(r => r.category))];
  const featuredResources = resources.filter(r => r.is_featured);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Torah Learning Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access our comprehensive library of Torah study materials, videos, audio lectures, and educational content.
          </p>
        </motion.div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.slice(0, 3).map((resource) => (
                <Card key={resource.id} className="border-2 border-torah-200 bg-torah-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-torah-600">
                        {getResourceIcon(resource.resource_type)}
                      </div>
                      <Badge className="bg-torah-600">Featured</Badge>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <p className="text-sm text-gray-600">by {resource.author}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{resource.download_count} downloads</span>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(resource)}
                        className="bg-torah-600 hover:bg-torah-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            {categories.slice(0, 4).map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading resources...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="text-torah-600">
                            {getResourceIcon(resource.resource_type)}
                          </div>
                          <Badge variant="outline">{resource.resource_type}</Badge>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <p className="text-sm text-gray-600">by {resource.author}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
                        
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-xs text-gray-500">{resource.download_count} downloads</span>
                          <Button 
                            size="sm" 
                            onClick={() => handleDownload(resource)}
                          >
                            {resource.external_url ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Visit
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {filteredResources.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Resources Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;

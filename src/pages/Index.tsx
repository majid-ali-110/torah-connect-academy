
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Heart, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Connect with Jewish Learning
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover qualified teachers, join live classes, and explore the depths of Jewish wisdom 
          in a supportive online community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/courses">Browse Courses</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Database Status Section */}
      <section className="container mx-auto px-4 py-8">
        <DatabaseStatus />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Expert Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Learn from qualified rabbis and experienced Jewish educators from around the world.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Live Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Join interactive live sessions and study groups with fellow learners.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Sponsor Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Support Jewish education by sponsoring courses for those in need.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Flexible Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Study at your own pace with personalized one-on-one sessions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Jewish Learning Journey?</h2>
          <p className="text-xl mb-8">Join thousands of students already learning with us.</p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/auth">Sign Up Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

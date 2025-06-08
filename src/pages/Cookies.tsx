
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const Cookies = () => {
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
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How we use cookies and similar technologies on our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Cookies are small text files that are placed on your device when you visit our website. 
                      They help us provide you with a better experience by remembering your preferences and 
                      understanding how you use our service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
                        <p className="text-gray-700 leading-relaxed">
                          These cookies are necessary for our website to function properly. They enable basic 
                          features like page navigation, access to secure areas, and authentication.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Performance Cookies</h3>
                        <p className="text-gray-700 leading-relaxed">
                          These cookies help us understand how visitors interact with our website by collecting 
                          and reporting information anonymously. This helps us improve our service.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Functional Cookies</h3>
                        <p className="text-gray-700 leading-relaxed">
                          These cookies allow our website to remember choices you make and provide enhanced, 
                          more personal features, such as language preferences and user interface customizations.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Targeting Cookies</h3>
                        <p className="text-gray-700 leading-relaxed">
                          These cookies may be set through our site by our advertising partners to build a 
                          profile of your interests and show you relevant content on other sites.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We may use third-party services that place cookies on your device. These include:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Google Analytics for website analytics</li>
                      <li>Payment processors for secure transactions</li>
                      <li>Video conferencing platforms for online lessons</li>
                      <li>Customer support tools</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You can control and manage cookies in various ways:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Browser settings: Most browsers allow you to control cookies through their settings</li>
                      <li>Cookie preferences: Use our cookie preference center to customize your settings</li>
                      <li>Opt-out links: Some third-party services provide direct opt-out mechanisms</li>
                      <li>Privacy tools: Use browser extensions or privacy tools to manage cookies</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Impact of Disabling Cookies</h2>
                    <p className="text-gray-700 leading-relaxed">
                      If you disable cookies, some features of our website may not work properly. 
                      Essential cookies are required for basic functionality, while other cookies 
                      enhance your experience but are not strictly necessary.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Cookie Retention</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Cookies have different lifespans:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Session cookies: Deleted when you close your browser</li>
                      <li>Persistent cookies: Remain on your device for a set period or until manually deleted</li>
                      <li>Analytics cookies: Typically retained for 13-26 months</li>
                      <li>Preference cookies: May be retained for up to 12 months</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Updates to Cookie Policy</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Cookie Policy from time to time to reflect changes in technology, 
                      legislation, or our business practices. We will notify you of any significant changes 
                      through our website or other communication methods.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <p className="text-gray-700 leading-relaxed">
                      If you have questions about our use of cookies or this Cookie Policy, 
                      please contact us at privacy@torahlearn.com.
                    </p>
                  </section>

                  <div className="text-sm text-gray-500 mt-8 pt-8 border-t">
                    Last updated: January 8, 2025
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Cookies;

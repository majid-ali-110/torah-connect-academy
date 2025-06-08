
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How we collect, use, and protect your personal information
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We collect information you provide directly to us, such as when you create an account, 
                          make a purchase, or contact us for support. This may include your name, email address, 
                          phone number, and payment information.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We automatically collect certain information about your use of our service, including 
                          your IP address, browser type, operating system, and usage patterns.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>To provide, maintain, and improve our services</li>
                      <li>To process transactions and send related information</li>
                      <li>To send technical notices, updates, and support messages</li>
                      <li>To respond to your comments, questions, and requests</li>
                      <li>To communicate with you about products, services, and events</li>
                      <li>To monitor and analyze trends, usage, and activities</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We do not sell, trade, or otherwise transfer your personal information to third parties 
                      without your consent, except in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>With service providers who assist us in operating our platform</li>
                      <li>When required by law or to protect our rights</li>
                      <li>In connection with a merger, acquisition, or sale of assets</li>
                      <li>With your explicit consent</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your personal 
                      information against unauthorized access, alteration, disclosure, or destruction. However, 
                      no method of transmission over the internet is 100% secure.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Depending on your location, you may have the following rights regarding your personal information:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Access to your personal information</li>
                      <li>Correction of inaccurate information</li>
                      <li>Deletion of your personal information</li>
                      <li>Restriction of processing</li>
                      <li>Data portability</li>
                      <li>Objection to processing</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We use cookies and similar tracking technologies to collect and track information about 
                      your use of our service. You can control the use of cookies through your browser settings.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Our service is not directed to children under 13. We do not knowingly collect personal 
                      information from children under 13. If we become aware that we have collected personal 
                      information from a child under 13, we will take steps to delete such information.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Changes to Privacy Policy</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any changes 
                      by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about this Privacy Policy, please contact us at privacy@torahlearn.com.
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

export default Privacy;


import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
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
              Terms of Use
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                      By accessing and using TorahLearn, you accept and agree to be bound by the terms and provision of this agreement. 
                      If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                    <p className="text-gray-700 leading-relaxed">
                      TorahLearn provides an online platform for Torah study, connecting students with qualified teachers and offering 
                      various educational resources. Our service includes video lessons, study materials, and community features.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Provide accurate and complete information when creating an account</li>
                      <li>Maintain the confidentiality of your account credentials</li>
                      <li>Use the service in accordance with all applicable laws and regulations</li>
                      <li>Respect other users and maintain appropriate conduct during sessions</li>
                      <li>Not share or distribute copyrighted content without permission</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Payment and Billing</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Payment for services is required in advance. All fees are non-refundable except as required by law. 
                      We reserve the right to change our pricing structure at any time with appropriate notice.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                    <p className="text-gray-700 leading-relaxed">
                      All content provided through our platform, including but not limited to text, graphics, logos, and software, 
                      is the property of TorahLearn or its content suppliers and is protected by copyright laws.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Privacy Policy</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                      to understand our practices.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                    <p className="text-gray-700 leading-relaxed">
                      TorahLearn shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                      including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                      including without limitation if you breach the Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                      If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about these Terms, please contact us at legal@torahlearn.com.
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

export default Terms;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-pink-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="prose prose-pink max-w-none">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: March 5, 2025</p>

          <p>
            At My Local Soft Play ("we," "us," or "our"), we are committed to protecting your privacy 
            and ensuring the security of your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our website and services.
          </p>

          <h2>Information We Collect</h2>
          
          <h3>Analytics and Cookies</h3>
          <p>
            We use Google Analytics 4 (GA4) to understand how visitors interact with our website. GA4 collects:
          </p>
          <ul>
            <li>Pages visited and time spent on each page</li>
            <li>Search terms used on our website</li>
            <li>Technical information (browser type, device type, screen resolution)</li>
            <li>Approximate location (country and city level only)</li>
            <li>Interaction data (clicks, scrolls, and navigation patterns)</li>
          </ul>
          <p>
            Google Analytics uses cookies and similar tracking technologies to collect and analyze this information. 
            You can opt-out of analytics tracking by declining cookies through our cookie banner or using Google's 
            browser add-on to opt-out of Analytics.
          </p>

          <h3>Information You Provide</h3>
          <ul>
            <li>Contact information (name, email address, phone number)</li>
            <li>Account information when you register</li>
            <li>Reviews and ratings you submit</li>
            <li>Messages and correspondence through our contact forms</li>
            <li>Information about your soft play area if you list it on our platform</li>
          </ul>

          <h3>Information Automatically Collected</h3>
          <ul>
            <li>Device information (browser type, IP address, device type)</li>
            <li>Usage data (pages visited, time spent, interactions)</li>
            <li>Location data (when you search for soft play areas near you)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process your searches and show relevant soft play areas</li>
            <li>Send you updates and notifications you've requested</li>
            <li>Improve our website and services through analytics</li>
            <li>Analyze user behavior and optimize user experience</li>
            <li>Measure the effectiveness of our features and content</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect and store information about your interactions 
            with our website. These technologies help us:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our website through analytics</li>
            <li>Improve our services based on usage patterns</li>
            <li>Provide personalized content and recommendations</li>
          </ul>
          
          <h3>Types of Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
            <li><strong>Analytics Cookies:</strong> Used by Google Analytics to collect usage data</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
          </ul>

          <p>
            You can control cookie preferences through your browser settings or our cookie consent banner. 
            Declining analytics cookies will not affect your ability to use our website, but it will prevent 
            us from collecting analytics data about your visit.
          </p>

          <h2>Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Soft play area owners (when you submit an inquiry)</li>
            <li>Service providers who assist in our operations</li>
            <li>Analytics providers (Google Analytics)</li>
            <li>Law enforcement when required by law</li>
            <li>Third parties with your explicit consent</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Withdraw consent at any time</li>
            <li>Request data portability</li>
            <li>Opt-out of analytics tracking</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly collect personal 
            information from children under 13. If you are a parent or guardian and believe your child 
            has provided us with personal information, please contact us.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@playfinderuk.com</li>
            <li>Address: 123 Play Street, London, EC1A 1BB, United Kingdom</li>
            <li>Phone: +44 (0) 20 1234 5678</li>
          </ul>

          <div className="mt-8 border-t pt-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-pink-500 hover:text-pink-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
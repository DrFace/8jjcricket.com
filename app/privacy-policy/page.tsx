import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - 8jj Cricket',
  description: 'Privacy Policy for 8jj Cricket mobile application. Learn how we handle your data and protect your privacy.',
  openGraph: {
    title: 'Privacy Policy - 8jj Cricket',
    description: 'Privacy Policy for 8jj Cricket mobile application',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Privacy Policy</h1>
          <p className="text-xl text-center text-blue-100">8jj Cricket Mobile Application</p>
          <p className="text-center text-blue-200 mt-4">Effective Date: January 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-blue-600">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Overview
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            8jj Group (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the 8jj Cricket mobile application (&quot;App&quot;).
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            This Privacy Policy explains how we handle information when you use the App.
          </p>
          <p className="text-gray-700 leading-relaxed font-medium">
            By using the App, you agree to this Privacy Policy.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-green-100 text-green-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Information We Collect
          </h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
            <p className="font-bold text-blue-900 mb-2">Important:</p>
            <p className="text-blue-800">8jj Cricket does NOT require user registration or login.</p>
          </div>

          <p className="text-gray-700 mb-4">We may collect limited, non-personal information to ensure proper app functionality:</p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Device Information:</p>
                <p className="text-gray-600">device type, operating system version, app version</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Usage Data:</p>
                <p className="text-gray-600">screens viewed, features used, crash logs, and performance data</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Network Information:</p>
                <p className="text-gray-600">IP address (used only for security and content delivery)</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="font-bold text-red-900 mb-2">We do NOT collect:</p>
            <ul className="text-red-800 space-y-1">
              <li>• Names, emails, phone numbers</li>
              <li>• Login credentials</li>
              <li>• Payment or financial data</li>
              <li>• Contacts or messages</li>
            </ul>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-purple-100 text-purple-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            How We Use Information
          </h2>
          <p className="text-gray-700 mb-4">We use collected data only to:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">📊</span>
                <p className="font-semibold text-gray-900">Display cricket scores, match details, and news</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">⚡</span>
                <p className="font-semibold text-gray-900">Improve app performance and stability</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🔧</span>
                <p className="font-semibold text-gray-900">Fix crashes and technical issues</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">✨</span>
                <p className="font-semibold text-gray-900">Optimize user experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-indigo-100 text-indigo-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </span>
            Third-Party Services
          </h2>
          <p className="text-gray-700 mb-4">The App may use trusted third-party services for:</p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              App stability and crash reporting
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Sports data delivery
            </li>
          </ul>
          <p className="text-gray-600 text-sm">
            These services only receive data necessary to perform their function and are required to comply with applicable privacy laws.
          </p>
        </div>

        {/* Advertising */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-yellow-100 text-yellow-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </span>
            Advertising
          </h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <p className="text-green-900 font-medium mb-2">8jj Cricket does not serve personalized ads and does not track users across apps or websites.</p>
            <p className="text-green-800 text-sm">If advertising is added in the future, this Privacy Policy will be updated accordingly.</p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-pink-100 text-pink-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            Children&apos;s Privacy
          </h2>
          <p className="text-gray-700 mb-2">The App is not directed to children under 13.</p>
          <p className="text-gray-700 font-medium">We do not knowingly collect personal data from children.</p>
        </div>

        {/* Data Security & Retention */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-red-100 text-red-600 rounded-lg p-2 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              Data Security
            </h2>
            <p className="text-gray-700 mb-3">We use reasonable technical and organizational measures to protect data.</p>
            <p className="text-gray-600 text-sm">However, no method of transmission or storage is 100% secure.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-teal-100 text-teal-600 rounded-lg p-2 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Data Retention
            </h2>
            <p className="text-gray-700 mb-2">We retain data only for as long as necessary to:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Maintain app functionality</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-cyan-100 text-cyan-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </span>
            Your Rights
          </h2>
          <p className="text-gray-700 mb-4">Depending on your location, you may have rights to:</p>
          <div className="space-y-3">
            <div className="flex items-start bg-blue-50 p-4 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700">Request information about collected data</p>
            </div>
            <div className="flex items-start bg-blue-50 p-4 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700">Request deletion of data where applicable</p>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg">
            <p className="font-semibold mb-1">Contact us at:</p>
            <a href="mailto:official8jjgroup@gmail.com" className="text-blue-100 hover:text-white underline">
              official8jjgroup@gmail.com
            </a>
          </div>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-orange-100 text-orange-600 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-2">We may update this Privacy Policy from time to time.</p>
          <p className="text-gray-700">Updates will be reflected in the App and on our website.</p>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
            <span className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Contact Us
          </h2>
          <div className="text-center space-y-3">
            <div>
              <p className="text-blue-200 mb-1">Developer</p>
              <p className="text-xl font-semibold">8jj Group</p>
            </div>
            <div>
              <p className="text-blue-200 mb-1">Email</p>
              <a href="mailto:official8jjgroup@gmail.com" className="text-xl font-semibold hover:text-blue-200 transition-colors">
                official8jjgroup@gmail.com
              </a>
            </div>
            <div>
              <p className="text-blue-200 mb-1">Website</p>
              <a href="https://8jjcricket.com" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:text-blue-200 transition-colors">
                https://8jjcricket.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">Last Updated: January 2026</p>
          <p className="text-sm mt-2">© 2026 8jj Group. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

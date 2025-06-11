import React from 'react';

function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary-500">About SkinScan</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            SkinScan is dedicated to bridging the gap between patients and healthcare providers through innovative technology.
            We strive to make quality healthcare accessible, efficient, and personalized for everyone.
          </p>
          <p className="text-gray-700">
            Our platform empowers patients to take control of their health journey while giving medical professionals the tools they need
            to provide the best possible care.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2023, SkinScan emerged from a simple observation: healthcare systems worldwide face challenges in coordination,
            communication, and accessibility.
          </p>
          <p className="text-gray-700">
            Our team of healthcare professionals and technology experts joined forces to create a solution that addresses these pain points,
            resulting in the comprehensive platform you see today.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-primary-100 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Patient-Centered Care</h3>
                <p className="text-gray-700">We believe in putting patients first, designing every feature with their needs in mind.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-100 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Innovation</h3>
                <p className="text-gray-700">We continuously evolve our platform to incorporate the latest advancements in healthcare technology.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-100 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Data Security</h3>
                <p className="text-gray-700">We adhere to the highest standards of data protection to ensure patient information remains secure.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
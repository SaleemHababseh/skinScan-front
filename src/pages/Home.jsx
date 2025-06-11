import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Calendar, MessageCircle, Shield, Activity, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Advanced AI Skin Analysis & Expert Care
              </h1>
              <p className="mt-6 text-lg">
                Upload your skin images for instant AI diagnosis and connect with specialist dermatologists for professional advice and treatment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary-500 hover:bg-neutral-100">
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-[300px] overflow-hidden rounded-xl shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Doctor using SkinScan app" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-sm font-medium text-white/80">Doctor's Dashboard</p>
                  <p className="text-xl font-bold text-white">SkinScan Pro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">How SkinScan Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Our platform combines cutting-edge AI technology with expert dermatologists to provide accurate diagnosis and personalized care.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                <Upload className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-neutral-900 dark:text-neutral-100">Upload Images</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Take clear photos of your skin concern and upload them securely to our platform.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                <Activity className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-neutral-900 dark:text-neutral-100">AI Analysis</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Our advanced AI instantly analyzes your skin images and provides an initial diagnosis.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                <MessageCircle className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-neutral-900 dark:text-neutral-100">Expert Consultation</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Connect with specialist dermatologists who review your case and provide professional advice.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-neutral-50 py-20 dark:bg-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Comprehensive Skin Care Platform
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Our platform offers a range of features designed to provide you with the best possible skin care experience.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                <Shield className="h-6 w-6 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-neutral-900 dark:text-neutral-100">Privacy & Security</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Your data is protected with enterprise-grade security and strict privacy protocols.
              </p>
            </Card>
            
            <Card className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                <Calendar className="h-6 w-6 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-neutral-900 dark:text-neutral-100">Easy Appointments</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Book appointments with dermatologists directly through our platform with just a few clicks.
              </p>
            </Card>
            
            <Card className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                <Award className="h-6 w-6 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-neutral-900 dark:text-neutral-100">Expert Dermatologists</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Our network of board-certified dermatologists ensures you receive the highest quality care.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-primary py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Ready to Transform Your Skin Care?</h2>
            <p className="mt-4 text-lg">
              Join thousands of users who have discovered the benefits of AI-powered dermatology and expert consultations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-500 hover:bg-neutral-100">
                  Create Your Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
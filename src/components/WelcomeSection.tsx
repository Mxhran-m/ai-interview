import Spline from '@splinetool/react-spline';
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-interview-background animate-fadeIn relative">
      <Spline className='-z-50 absolute' scene="https://prod.spline.design/ZQTNW4Xgt323Png8/scene.splinecode" />
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-gray-500 to-white bg-clip-text text-transparent text-shadow-xl">
            Master Your Interview Skills
          </h1>
          <p className="text-xl text-slate-400 text-[#939185] shadow-2xl">
            Practice with our AI-powered interview assistant and get personalized feedback
          </p>
        </div>        
        <Link
          to="/interview-setup"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-interview-accent rounded-full hover:bg-opacity-90 transition-all duration-200 gap-2"
        >
          Start Interview
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default WelcomeSection;

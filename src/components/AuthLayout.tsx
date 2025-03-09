import React from 'react';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <GraduationCap className="w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};
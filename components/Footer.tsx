import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 PulmoScan AI. All rights reserved.
        </p>
        <p className="text-gray-400 text-xs mt-2 max-w-2xl mx-auto">
          Disclaimer: This tool is for demonstration and educational purposes only. 
          It is not a medical device and should not be used for diagnosis or treatment decisions. 
          Always consult with a qualified healthcare professional.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
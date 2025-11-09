import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-gray-700">This is an offline-first blog developed in the BIT2208 course. It leverages local SQLite (sql.js) for offline storage and Firebase for cloud sync.</p>
    </div>
  );
};

export default About;

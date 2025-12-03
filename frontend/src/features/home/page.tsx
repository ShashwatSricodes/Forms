import React from 'react';
// Import all components from the barrel file
import Feature from './components/feature';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';

const HomePage = () => {
  return (
    <main>
      <Hero />
     <section id="features">   {/* 👈 Add this wrapper */}
        <Feature />
      </section>
    <section id="pricing">
  <Pricing />
</section>
      <Testimonials />
      {/* Add other page elements here */}
    </main>
  );
};

// Export the page as the default export
export default HomePage;
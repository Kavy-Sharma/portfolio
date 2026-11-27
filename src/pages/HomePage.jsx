import React from 'react';
import LockIntro from '../components/LockIntro';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Building from '../components/Building';

export default function HomePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* 1. Interactive Lock Intro (shown once per session) */}
      <LockIntro />

      <div className="wrap">
        {/* 2. Header */}
        <Header />

        {/* 3. Hero */}
        <Hero />

        {/* 4. The Building (5 Floors + Ground Contact) */}
        <Building />

        <p className="tag srcap" style={{ margin: '80px 0 30px' }}>
          Portfolio &middot; verified facts from notes &amp; stats
        </p>
      </div>
    </div>
  );
}

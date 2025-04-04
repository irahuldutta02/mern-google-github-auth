// ./app/page.jsx
import React from "react";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
      <p>This page is accessible to everyone, signed in or not.</p>
      <p>Built with Next.js!</p>
    </div>
  );
}

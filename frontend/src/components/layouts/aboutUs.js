import React from "react";

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#f9f9f9"}} className="max-w-5xl mx-auto px-6 py-12 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Your Ticket to Freedom
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Welcome to <span className="font-semibold text-blue-600">Your Ticket to Freedom</span> – the marketplace that liberates you from virtual queues,
        frantic refreshing, and the fear of missing out.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        Say goodbye to back-alley deals and hello to a safe, secure space where sellers name their price and buyers never miss out. Whether you’re on your phone, tablet, or computer – and no matter the language or currency – we empower you to buy and sell tickets with total freedom.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        Experience your love of live events, <span className="italic">IRL</span>. Dance ‘til you drop. Sing at the top of your lungs. Laugh until you cry. Scream for that last-minute goal. With us, you're not just buying a ticket – you’re unlocking unforgettable moments with the people who share your passion.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        Life happens – and when it does, we’ve got your back. Easily and securely resell your ticket if plans change, and rest easy knowing our 100% order guarantee protects both buyers and sellers.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        From sports and music to comedy, festivals, theatre, and more – we bring you the widest, most diverse selection of events all in one place.
      </p>

      <p className="text-lg text-gray-700">
        Still have questions?{" "}
        <a href="/terms" className="text-blue-600 underline hover:text-blue-800">
          Check out our Terms and Conditions
        </a>{" "}
        for full details.
      </p>
    </div>
  );
};

export default AboutUs;

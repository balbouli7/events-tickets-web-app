import React from "react";

const Contact = () => {
  return (
    <div style={{ backgroundColor: "#f9f9f9"}} className="max-w-3xl mx-auto p-8  rounded-xl shadow-md text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Contact Us</h1>

      <p className="text-lg text-gray-700 mb-6">
        We’re here to help! Reach out to us anytime.
      </p>

      <div className="text-gray-800 text-xl space-y-4">
        <p>
          <strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-600 hover:underline">+123 456 7890</a>
        </p>
        <p>
          <strong>Phone:</strong> <a href="tel:+9876543210" className="text-blue-600 hover:underline">+987 654 3210</a>
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;

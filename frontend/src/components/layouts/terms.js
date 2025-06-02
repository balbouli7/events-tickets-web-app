import React from "react";

const TermsAndConditions = () => {
  return (
    <div style={{ backgroundColor: "#f9f9f9"}} className="max-w-5xl mx-auto px-6 py-12 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Terms & Conditions
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          1. Introduction
        </h2>
        <p className="text-gray-700">
          Welcome to Your Ticket to Freedom. These terms govern your use of our
          platform. By accessing or using our services, you agree to be bound by
          them. Please read carefully.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          2. Buying Tickets
        </h2>
        <p className="text-gray-700">
          Buyers can purchase tickets listed by verified sellers. We do not own
          or generate tickets, but we provide a safe, secure space to connect buyers
          and sellers. Our 100% order guarantee ensures ticket authenticity or your
          money back.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          3. Selling Tickets
        </h2>
        <p className="text-gray-700">
          Sellers are responsible for accurately listing tickets. Prices can be set
          freely, but fraudulent, misleading, or duplicate listings are strictly
          prohibited. You must deliver tickets in time for the event.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          4. Order Guarantee
        </h2>
        <p className="text-gray-700">
          Every transaction is backed by our order guarantee. If you don’t receive
          valid tickets in time, or if there’s an issue, contact our support team
          for a resolution or full refund.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          5. Reselling & Refunds
        </h2>
        <p className="text-gray-700">
          If plans change, you may relist your ticket on our platform. Refunds are
          only issued for failed orders under our guarantee or if the event is
          cancelled with no rescheduled date.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          6. Event Cancellations
        </h2>
        <p className="text-gray-700">
          If an event is canceled and not rescheduled, buyers will receive a full
          refund. If the event is postponed, the ticket remains valid for the new
          date.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          7. User Accounts
        </h2>
        <p className="text-gray-700">
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account. Please notify us
          immediately of any unauthorized use.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          8. Changes to Terms
        </h2>
        <p className="text-gray-700">
          We may update these terms from time to time. Continued use of the
          platform after changes are posted constitutes your acceptance of the
          updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          9. Contact Us
        </h2>
        <p className="text-gray-700">
          If you have questions about these Terms and Conditions, please contact
          our support team at{" "}
          <a
            href="mailto:support@yourtickettofreedom.com"
            className="text-blue-600 underline"
          >
            support@yourtickettofreedom.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;

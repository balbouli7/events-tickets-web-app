import { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  deleteOrder,
  initiateStripePayment,
  verifyStripePayment,
} from "../../api/userServices";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context.js/cartContext";
import { OrdersContext } from "../../context.js/orderContext";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "2rem",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(124, 54, 54, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  button: {
    backgroundColor: "#6772e5",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  message: {
    marginTop: "1rem",
    padding: "0.75rem",
    backgroundColor: "#ffe0e0",
    color: "#b20000",
    borderRadius: "6px",
    fontSize: "0.95rem",
  },
  loading: {
    textAlign: "center",
    marginTop: "3rem",
    fontSize: "1.1rem",
    color: "#444",
  },
};

const StripeForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const { clearCart, setCartItems } = useContext(CartContext);
  const { refreshOrders } = useContext(OrdersContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: "if_required",
      });

      if (submitError) {
        await verifyStripePayment(orderId, "failed", token);
        setMessage(`Payment failed: ${submitError.message}`);
        return;
      }

      // In your handleSubmit function (StripeCheckout.js)
// In your handleSubmit function (StripeCheckout.js)
if (paymentIntent.status === "succeeded") {
  const verificationResponse = await verifyStripePayment(
    orderId, 
    "succeeded", 
    token
  );

  sessionStorage.removeItem("selectedTickets");
  sessionStorage.removeItem("selectedEvent");
  await refreshOrders();

  // Navigate to ticket page with the ticket data
  navigate(`/admin/tickets/${orderId}`, {
    state: { 
      ticketData: verificationResponse.ticket 
    }
  });
}
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            ...styles.button,
            ...(loading || !stripe ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {message && <div style={styles.message}>{message}</div>}
      </form>
    </div>
  );
};

const StripeCheckout = () => {
  const { orderId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const initializePayment = async () => {
      try {
        const res = await initiateStripePayment(orderId, "stripe", token);
        if (isMounted) {
          setPaymentData({
            clientSecret: res.clientSecret,
            appearance: { theme: "stripe" },
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to initialize payment. Please try again.");
          setLoading(false);
          console.error("Payment initialization error:", err);
        }
      }
    };

    initializePayment();

    return () => {
      isMounted = false;
    };
  }, [orderId, token]);

  if (loading) {
    return <div style={styles.loading}>Loading payment gateway...</div>;
  }

  if (error) {
    return <div style={styles.loading}>{error}</div>;
  }

  if (!paymentData?.clientSecret) {
    return <div style={styles.loading}>Could not load payment details</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Complete Your Payment</h2>
      <Elements
        stripe={stripePromise}
        options={paymentData}
        key={paymentData.clientSecret}
      >
        <StripeForm orderId={orderId} />
      </Elements>
    </div>
  );
};

export default StripeCheckout;
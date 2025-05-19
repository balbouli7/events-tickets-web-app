import "./App.css";
import { AuthProvider } from "./context.js/authContext";
import { Route, Routes } from "react-router-dom";
import Register from "./components/authComponents/register";
import { useState } from "react";
import Login from "./components/authComponents/login";
import VerifyUser from "./components/authComponents/verifyUser";
import ResetPassword from "./components/authComponents/resetPassword";
import ForgetPassword from "./components/authComponents/forgetPassword";
import GetAllUsers from "./components/getAllUsers";
import UpdateUser from "./components/updateProfile";
import UserProfile from "./components/userProfile";
import AdminLayout from "./components/adminDashboard/adminLayout";
import AdminHome from "./components/adminDashboard/adminHome";
import PrivateRoute from "./components/adminDashboard/privateRoutes";
import CreateEvent from "./components/eventsComponents/addEvents";
import GetAllEvents from "./components/eventsComponents/allEvents";
import AddCategory from "./components/categoryComponents/createCategory";
import AllCategories from "./components/categoryComponents/allCategories";
import EventDetail from "./components/eventsComponents/eventDetails";
import UpdateEvent from "./components/eventsComponents/updateEvent";
import AdminOrderList from "./components/orderComponents/allOrders";
import OrderDetails from "./components/orderComponents/orderDetails";
import CheckoutForm from "./components/orderComponents/createOrder";
import MyOrders from "./components/orderComponents/myOrders";
import StripeCheckout from "./components/paymentComponents.js/StripeCheckout";
import { CartProvider } from "./context.js/cartContext";
import { OrdersProvider } from "./context.js/orderContext";
import QRCodeDisplay from "./components/ticketComponents/QRCodeDisplay";
import TicketDisplay from "./components/ticketComponents/QRCodeDisplay";
import UserTickets from "./components/ticketComponents/userTickets";
import AllTickets from "./components/ticketComponents/allTickets";

function App() {
  const [userEmail, setUserEmail] = useState("");

  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
         <OrdersProvider>
        <Routes>
          {/* auth routes */}
          <Route
            path="/register"
            element={<Register setUserEmail={setUserEmail} />}
          />
          <Route path="/verify" element={<VerifyUser email={userEmail} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<PrivateRoute element={<AdminLayout />} />}
          >
            <Route path="home" element={<AdminHome />} />
            <Route path="users" element={<GetAllUsers />} />
            <Route path="users/details/:id" element={<UserProfile />} />
            <Route path="users/update/:id" element={<UpdateUser />} />
            <Route path="createEvent" element={<CreateEvent />} />
            <Route path="events" element={<GetAllEvents />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="addCategory" element={<AddCategory />} />
            <Route path="allCategory" element={<AllCategories />} />
            <Route path="update-event/:id" element={<UpdateEvent />} />
            {/* <Route path="orders" element={<AdminOrderList />} /> */}
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="MyOrders" element={<MyOrders />} />
            <Route path="checkout/:eventId" element={<CheckoutForm />} />
            <Route path="payment/:orderId" element={<StripeCheckout />} />
            <Route path="tickets/:orderId" element={<TicketDisplay />} />
            <Route path="tickets" element={<UserTickets />} />
            <Route path="allTickets" element={<AllTickets/>}/>
            {/* More admin routes */}
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Login />} />
        </Routes>
        </OrdersProvider> 
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;

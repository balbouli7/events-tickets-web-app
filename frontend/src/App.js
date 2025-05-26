import "./App.css";
import { AuthProvider } from "./context.js/authContext";
import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./components/authComponents/register";
import { useEffect, useState } from "react";
import Login from "./components/authComponents/login";
import VerifyUser from "./components/authComponents/verifyUser";
import ResetPassword from "./components/authComponents/resetPassword";
import ForgetPassword from "./components/authComponents/forgetPassword";
import GetAllUsers from "./components/getAllUsers";
import UpdateUser from "./components/updateProfile";
import UserProfile from "./components/userProfile";
import AdminHome from "./components/layouts/adminHome";
import PrivateRoute from "./components/layouts/privateRoutes";
import CreateEvent from "./components/eventsComponents/addEvents";
import GetAllEvents from "./components/eventsComponents/allEvents";
import AddCategory from "./components/categoryComponents/createCategory";
import AllCategories from "./components/categoryComponents/allCategories";
import EventDetail from "./components/eventsComponents/eventDetails";
import UpdateEvent from "./components/eventsComponents/updateEvent";
import OrderDetails from "./components/orderComponents/orderDetails";
import CheckoutForm from "./components/orderComponents/createOrder";
import MyOrders from "./components/orderComponents/myOrders";
import StripeCheckout from "./components/paymentComponents.js/StripeCheckout";
import { CartProvider } from "./context.js/cartContext";
import { OrdersProvider } from "./context.js/orderContext";
import TicketDisplay from "./components/ticketComponents/QRCodeDisplay";
import UserTickets from "./components/ticketComponents/userTickets";
import AllTickets from "./components/ticketComponents/allTickets";
import LoadingSpinner from "./spinner";
import EventsByCategory from "./components/eventsComponents/eventsByCategory";
import DashboardLayout from "./components/layouts/dashboardLayout";
import HomePage from "./components/layouts/homePage";

function App() {
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== currentLocation.pathname) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setCurrentLocation(location);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location, currentLocation]);

  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            {isLoading && <LoadingSpinner />}
            <Routes location={currentLocation}>


              <Route path="/" element={<DashboardLayout />}>
                            {/* Auth Routes */}
                <Route path="register" element={<Register setUserEmail={setUserEmail} />} />
                <Route path="verify" element={<VerifyUser email={userEmail} />} />
                <Route path="login" element={<Login />} />
                <Route path="forgetpassword" element={<ForgetPassword />} />
                <Route path="resetpassword/:token" element={<ResetPassword />} />
                <Route path="admin/home" element={<PrivateRoute element={<AdminHome />} />} />
                <Route path="users" element={<PrivateRoute element={<GetAllUsers />} />} />
                <Route path="users/details/:id" element={<PrivateRoute element={<UserProfile />} />} />
                <Route path="users/update/:id" element={<PrivateRoute element={<UpdateUser />} />} />
                <Route path="createEvent" element={<PrivateRoute element={<CreateEvent />} />} />
                <Route path="events" element={<GetAllEvents />} />
                <Route path="events/:id" element={<EventDetail />}/>
                <Route path="addCategory" element={<PrivateRoute element={<AddCategory />} />} />
                <Route path="allCategories" element={<AllCategories />}/>
                <Route path="update-event/:id" element={<PrivateRoute element={<UpdateEvent />} />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="MyOrders" element={<MyOrders />} />
                <Route path="checkout/:eventId" element={<CheckoutForm />} />
                <Route path="payment/:orderId" element={<StripeCheckout />} />
                <Route path="tickets/:orderId" element={<TicketDisplay />} />
                <Route path="myTickets" element={<UserTickets />}/>
                <Route path="allTickets" element={<PrivateRoute element={<AllTickets />} />} />
                <Route path="eventsByCategory/:categoryId" element={<EventsByCategory />}/>
              </Route>

              {/* Default Route */}
              <Route path="/" element={<HomePage />} />
            </Routes>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;

import './App.css';
import { AuthProvider } from './context.js/authContext';
import { Route, Routes } from 'react-router-dom';
import Register from './components/authComponents/register';
import { useState } from 'react';
import Login from './components/authComponents/login';
import VerifyUser from './components/authComponents/verifyUser';
import ResetPassword from './components/authComponents/resetPassword';
import ForgetPassword from './components/authComponents/forgetPassword';
import GetAllUsers from './components/getAllUsers';
import UpdateUser from './components/updateProfile';
import UserProfile from './components/userProfile';
import AdminLayout from './components/adminDashboard/adminLayout';
import AdminHome from './components/adminDashboard/adminHome';
import PrivateRoute from './components/adminDashboard/privateRoutes';
import CreateEvent from './components/eventsComponents/addEvents';
import GetAllEvents from './components/eventsComponents/allEvents';
import AddCategory from './components/categoryComponents/createCategory';
import AllCategories from './components/categoryComponents/allCategories';
import EventDetail from './components/eventsComponents/eventDetails';
import UpdateEvent from './components/eventsComponents/updateEvent';

function App() {
  const [userEmail, setUserEmail] = useState(""); 

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* auth routes */}
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/verify" element={<VerifyUser email={userEmail} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute element={<AdminLayout />} />}>
            <Route path="home" element={<AdminHome />} />
            <Route path="users" element={<GetAllUsers />} />
            <Route path="users/details/:id" element={<UserProfile />} />
            <Route path="users/update/:id" element={<UpdateUser/>} />
            <Route path="createEvent" element={<CreateEvent/>} />
            <Route path="events" element={<GetAllEvents />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="addCategory" element={<AddCategory />} />
            <Route path="allCategory" element={<AllCategories />} />
            <Route path="/admin/update-event/:id" element={<UpdateEvent/>} />

            
            {/* More admin routes */}
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
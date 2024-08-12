import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Header from './components/Layout/Header/Header';
import Treatments from './pages/Treatments/Treatments';
import AddTreatments from './pages/Treatments/AddTreatments';
import Doctors from './pages/Doctors/Doctors';
import AddDoctors from './pages/Doctors/AddDoctors';
import AddFacility from './pages/Facilities/AddFacility';
import Facilities from './pages/Facilities/Facilities';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Auth/Login';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Signup from './pages/Auth/signup';
import EditTreatment from './pages/Treatments/EditTreatment';
import ViewTreatment from './pages/Treatments/ViewTreatment';
import ViewDoctor from './pages/Doctors/ViewDoctor';
import Profile from './pages/Profile/Profile';
import { useSelector } from 'react-redux';
import Home from './pages/Home/Home';

function App() {
  const loading = useLoadingWithRefresh();
  // console.log(hospital);
  return (
    <Router>
      <ToastContainer />
      <Header />
      {/* {loading ? (
        <h1>Sign In to continue</h1>
      ) : ( */}
      <Routes>
        <Route
          path="/add-treatments"
          element={
            <ApproveProtectedRoute>
              <AddTreatments />
            </ApproveProtectedRoute>
          }
        />

        <Route
          path="/edit-treatment/:id"
          element={
            <ApproveProtectedRoute>
              <EditTreatment />
            </ApproveProtectedRoute>
          }
        />

        <Route
          path="/view-treatment/:id"
          element={
            <ApproveProtectedRoute>
              <ViewTreatment />
            </ApproveProtectedRoute>
          }
        />

        <Route
          path="/treatments"
          element={
            <ApproveProtectedRoute>
              <Treatments />
            </ApproveProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ApproveProtectedRoute>
              <Doctors />
            </ApproveProtectedRoute>
          }
        />
        <Route
          path="/add-doctors"
          element={
            <ApproveProtectedRoute>
              <AddDoctors />
            </ApproveProtectedRoute>
          }
        />
        <Route
          path="/doctor/:id"
          element={
            <ApproveProtectedRoute>
              <ViewDoctor />
            </ApproveProtectedRoute>
          }
        />

        <Route
          path="/facilities"
          element={
            <ApproveProtectedRoute>
              <Facilities />
            </ApproveProtectedRoute>
          }
        />
        <Route
          path="/add-facility"
          element={
            <ApproveProtectedRoute>
              <AddFacility />
            </ApproveProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <LoginProtectAuth>
              <Login />
            </LoginProtectAuth>
          }
        />
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <AuthProtectedRoute>
              <Profile />
            </AuthProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {/* )} */}
    </Router>
  );
}

const ApproveProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { approved, isAuth } = useSelector(state => state.auth);
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!approved) {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }
  return children;
};

const LoginProtectAuth = ({ children }) => {
  const location = useLocation();
  const { isAuth } = useSelector(state => state.auth);
  if (isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const AuthProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuth } = useSelector(state => state.auth);
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default App;

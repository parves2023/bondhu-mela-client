import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";

import NotFound from "../components/NotFound";
import ForgotPass from "../components/ForgotPass";
import AddVisa from "../components/AddVisa";
import MyVisa from "../components/MyVisa";
import AllVisa from "../components/AllVisa";
import VisaDetails from "../components/VisaDetails";
import MyVisaApplications from "../components/MyVisaApplications";
import MyProfile from "../components/Profile/MyProfile";
import UpdateProfile from "../components/Profile/UpdateProfile";
import AllPeople from "../components/AllPeople/AllPeople";
import AllMessages from "../components/AllPeople/AllMessages";
import MyPosts from "../pages/MyPosts/MyPosts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
        loader: () => fetch("/words.json"),
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/forgotpass",
        element: <ForgotPass></ForgotPass>,
      },
      {
        path: "/add-visa",
        element: (
          <PrivateRoute>
            <AddVisa></AddVisa>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-added-visas",
        element: (
          <PrivateRoute>
            <MyVisa></MyVisa>
          </PrivateRoute>
        ),
      },
      {
        path: "/all-visas",
        element: <AllVisa></AllVisa>,
      },
      {
        path: "/details/:_id",
        element: (
          <PrivateRoute>
            <VisaDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-applications",
        element: (
          <PrivateRoute>
            <MyVisaApplications />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/update-profile",
        element: (
          <PrivateRoute>
            <UpdateProfile></UpdateProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/all-people",
        element: (
          <PrivateRoute>
            <AllPeople></AllPeople>
          </PrivateRoute>
        ),
      },
      {
        path: "/all-Messages",
        element: (
          <PrivateRoute>
            <AllMessages></AllMessages>
          </PrivateRoute>
        ),

      },
      {
        path: "/my-posts",
        element: (
          <PrivateRoute>
            <MyPosts></MyPosts>
          </PrivateRoute>
        ),
        
      },
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;

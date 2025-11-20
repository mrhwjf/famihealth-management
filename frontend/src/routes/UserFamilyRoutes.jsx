import React from "react";
import User_FamilyLayout from "../layouts/user/User_Family_Layout";
import Dashboard from "../pages/user/Dashboard";
import MyProfile from "../pages/user/MyProfile";
import MyFamily from "../pages/user/MyFamily";
import ContactDoctor from "../pages/user/ContactDoctor";
import Allergies from "../pages/user/Allergies";
import Vaccinations from "../pages/user/Vaccinations";
import Appointments from "../pages/user/Appointments";
import Settings from "../pages/user/Settings";
import Signout from "../pages/user/Signout";
const UserFamilyRoutes = {
  children: [
    {
      path: "/user_family",
      element: <User_FamilyLayout />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <MyProfile />,
        },
        {
          path: "my-family",
          element: <MyFamily />,
        },
        {
          path: "contact-doctor",
          element: <ContactDoctor />,
        },
        {
          path: "allergies",
          element: <Allergies />,
        },
        {
          path: "vaccinations",
          element: <Vaccinations />,
        },
        {
          path: "appointments",
          element: <Appointments />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "signout",
          element: <Signout />,
        },
      ],
    },
  ],
};
export default UserFamilyRoutes;

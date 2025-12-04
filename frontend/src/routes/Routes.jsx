import AdminRoutes from "./AdminRoutes";
import ErrorRoutes from "./ErrorRoutes";
import UserFamilyRoutes from "./UserFamilyRoutes";
const Routes = [AdminRoutes, ErrorRoutes, UserFamilyRoutes];
import DoctorRoutes from "./DoctorRoutes";
import AuthRoutes from "./AuthRoutes";

const Routes = [AuthRoutes, AdminRoutes, ErrorRoutes, DoctorRoutes];

export default Routes;
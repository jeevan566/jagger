import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import RFQs from "./pages/RFQs";
import CreateRFQ from "./pages/CreateRFQ";
import RFQDetails from "./pages/RFQDetails";
import SupplierRFQs from "./pages/SupplierRFQs";
import SubmitQuote from "./pages/SubmitQuote";
import CompareQuotes from "./pages/CompareQuotes";
import POList from "./pages/POList";
import PODetails from "./pages/PODetails";
import CreatePO from "./pages/CreatePO";
import AuditLogs from "./pages/AuditLogs";
import AdminSettings from "./pages/AdminSettings";
import Inventory from "./pages/Inventory"


export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
        <Route path="register" element={<Register />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<Login />} />
      <Route path="add-user" element={<AddUser />} />
      <Route path="suppliers" element={<Suppliers />} />
      <Route path="add-supplier" element={<AddSupplier />} />
      <Route path="categories" element={<Categories />} />
      <Route path="products" element={<Products />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="rfqs" element={<RFQs />} />
      <Route path="create-rfq" element={<CreateRFQ />} />
      <Route path="rfq/:id" element={<RFQDetails />} />
      <Route path="supplier-rfqs" element={<SupplierRFQs />} />
      <Route path="submit-quote/:id" element={<SubmitQuote />} />
      <Route path="rfq/:id/compare" element={<CompareQuotes />} />
      <Route path="pos" element={<POList />} />
      <Route path="po/:id" element={<PODetails />} />
      <Route path="create-po/:id" element={<CreatePO />} />
      <Route path="audit" element={<AuditLogs />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="/inventory" element={<Inventory />} />

    </Routes>
  );
}

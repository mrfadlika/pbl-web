import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import KatalogDitemukan from "../components/Katalog/Ditemukan";
import FormuliBarangHilang from "../components/Form/FormuliBarangHilang";
import FormuliBarangDitemukan from "../components/Form/FormuliBarangDitemukan";
import { ClaimForm, ReportForm } from "../components/Form";
import KatalogHilang from "../components/Katalog/Hilang";
import Login from "../components/Login";
import AdminDashboard from "../components/Admin/Dashboard";
import ReviewedAdmin from "../components/Admin/Review/Review";
import AdminReport from "../components/Admin/Report/Report";

function RouteIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lost-items" element={<KatalogHilang />} />
            <Route path="/found-items" element={<KatalogDitemukan />} />
            <Route path="/forms-lost" element={<FormuliBarangHilang />} />
            <Route path="/forms-found" element={<FormuliBarangDitemukan />} />
            <Route path="/forms/claim" element={<ClaimForm />} />
            <Route path="/forms/report" element={<ReportForm />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/review" element={<ReviewedAdmin />} />
            <Route path="/admin/reports" element={<AdminReport />} />
        </Routes>
    )
}

export default RouteIndex;
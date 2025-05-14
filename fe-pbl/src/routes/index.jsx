import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import KatalogDitemukan from "../components/Katalog/Ditemukan";
import FormuliBarangHilang from "../components/Form/FormuliBarangHilang";
import FormuliBarangDitemukan from "../components/Form/FormuliBarangDitemukan";
import { ClaimForm, ReportForm } from "../components/Form";
import KatalogHilang from "../components/Katalog/Hilang";

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
        </Routes>
    )
}

export default RouteIndex;
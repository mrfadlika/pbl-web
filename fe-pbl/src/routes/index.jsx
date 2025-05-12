import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import KatalogHilang from "../components/Katalog/Hilang";
import KatalogDitemukan from "../components/Katalog/Ditemukan";

function RouteIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lost-items" element={<KatalogHilang />} />
            <Route path="/found-items" element={<KatalogDitemukan />} />
        </Routes>
    )
}

export default RouteIndex;
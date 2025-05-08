import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";

function RouteIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default RouteIndex;
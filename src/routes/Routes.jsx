import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calculator from "../components/Calculator";

export default function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <div className="container mx-auto p-10 max-w-md">
                        <Calculator />
                    </div>
                }>
                </Route>
                <Route path="*" element={<div>404</div>}></Route>
            </Routes>
        </BrowserRouter>
    )
}
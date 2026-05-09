import { Outlet } from "react-router-dom";
import { HeaderLayout } from "../components/header-layout";

export const MainLayout = () => {
    return (
        <div className="app-container">
            <HeaderLayout />
            <main className="main-content">
                <Outlet/>
            </main>

        </div>
    )
}

export default MainLayout;
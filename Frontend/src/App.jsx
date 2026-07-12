import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import InvoicePage from "./pages/InvoicePage";

import RegisterPage from "./pages/RegisterPage";
import SignInPage from "./pages/SignInPage";

function App() {
    const location = useLocation();
    const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);
    
    return (
        <div className='flex h-screen text-gray-100 overflow-hidden'>
            {!isAuthPage && <Sidebar />}
            
            <Routes>
                <Route path='/' element={<SignInPage />} />
                <Route path='/login' element={<SignInPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/overview' element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
                <Route path='/invoice' element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
                <Route path='/products' element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                <Route path='/users' element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
                <Route path='/sales' element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
                <Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path='/analytics' element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
        </div>
    );
}

export default App;

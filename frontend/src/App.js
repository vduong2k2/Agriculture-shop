import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
} from "./Routes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadSeller, loadUser } from "./redux/actions/user";
import { useSelector } from "react-redux";
import { ShopHomePage } from "./ShopRoutes.js";
///
const App = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { isLoading, seller, isSeller } = useSelector((state) => state.user);
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
  }, []);
  return (
    <>
      {loading || isLoading ? null : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route
              path="/activation/:activation_token"
              element={<ActivationPage />}
            />
            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route path="/shop/:id" element={<ShopHomePage />} />
            <Route
              path="/seller/activation/:activation_token"
              element={<SellerActivationPage />}
            />
          </Routes>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;

import { createBrowserRouter } from "react-router-dom";
import { CatalogPage } from "../pages/catalog";
import { ProductPage } from "../pages/product";
import { CartPage } from "../pages/cart";
import { CheckoutPage } from "../pages/checkout";
import { OrderStatusPage } from "../pages/order-status";
import { RootLayout } from "../components/template/Roottemplate";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <CatalogPage /> },
      { path: "/p/:id", element: <ProductPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/order/:id", element: <OrderStatusPage /> },
    ],
  },
]);
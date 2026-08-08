import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import SchoolBag from "@/pages/SchoolBag";
import Offers from "@/pages/Offers";
import Delivery from "@/pages/Delivery";
import Branches from "@/pages/Branches";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ComingSoon from "@/pages/ComingSoon";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:slug" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/school-bag" element={<SchoolBag />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<ComingSoon titleKey="search" />} />
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </LanguageProvider>
  );
}

export default App;

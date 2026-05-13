import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { trackPageView } from "@/lib/analytics";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AboutUsPage = lazy(() => import("@/pages/AboutUsPage"));
const OurServicesPage = lazy(() => import("@/pages/OurServicesPage"));
const LocalResidentialMovingPage = lazy(() => import("@/pages/LocalResidentialMovingPage"));
const PackingUnpackingPage = lazy(() => import("@/pages/PackingUnpackingPage"));
const CorporateRelocationPage = lazy(() => import("@/pages/CorporateRelocationPage"));
const StorageServicesPage = lazy(() => import("@/pages/StorageServicesPage"));
const ContactUsPage = lazy(() => import("@/pages/ContactUsPage"));
const SubmitTicketPage = lazy(() => import("@/pages/SubmitTicketPage"));
const GetFreeQuotePage = lazy(() => import("@/pages/GetFreeQuotePage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ThankYouPage = lazy(() => import("@/pages/ThankYouPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function LoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="our-services" element={<OurServicesPage />} />
            <Route path="our-services/local-residential-moving" element={<LocalResidentialMovingPage />} />
            <Route path="our-services/packing-unpacking-services" element={<PackingUnpackingPage />} />
            <Route path="our-services/corporate-relocation" element={<CorporateRelocationPage />} />
            <Route path="our-services/storage-services" element={<StorageServicesPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="contact-us/submit-ticket" element={<SubmitTicketPage />} />
            <Route path="get-free-quote" element={<GetFreeQuotePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="thank-you" element={<ThankYouPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

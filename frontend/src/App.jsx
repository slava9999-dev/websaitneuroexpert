import { useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServiceCards from "./components/ServiceCards";
import Advantages from "./components/Advantages";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import VideoBackground from "./components/VideoBackground";
import Analytics from "./components/Analytics";
import SectionErrorBoundary from "./components/SectionErrorBoundary";
import { sendHit } from "./utils/metrika";

// Lazy load non-critical components
const Portfolio = lazy(() => import("./components/Portfolio"));
const Team = lazy(() => import("./components/Team"));
const ContactForm = lazy(() => import("./components/ContactForm"));
const AIChat = lazy(() => import("./components/AIChat"));

function App() {
  useEffect(() => {
    const sendPageHit = () => {
      if (typeof window === "undefined") return;
      const { pathname, search, hash } = window.location;
      sendHit(`${pathname}${search}${hash}`);
    };

    sendPageHit();
    window.addEventListener("hashchange", sendPageHit);
    window.addEventListener("popstate", sendPageHit);

    return () => {
      window.removeEventListener("hashchange", sendPageHit);
      window.removeEventListener("popstate", sendPageHit);
    };
  }, []);

  return (
    <div className="App bg-[#0b0f17] min-h-screen relative">
      <Toaster position="top-center" />
      
      {/* Global Video Background (for sections after Hero) */}
      <VideoBackground />
      
      {/* Content above video background */}
      <div className="relative z-10">
        <Header />
        <StickyCTA />
        
        <main>
          {/* 1. Hero с видео */}
          <SectionErrorBoundary sectionName="Hero">
            <Hero />
          </SectionErrorBoundary>
          
          {/* 2. Карточки услуг с AI консультация */}
          <SectionErrorBoundary sectionName="Услуги">
            <ServiceCards />
          </SectionErrorBoundary>
          
          {/* 3. Портфолио/Кейсы - Lazy loaded */}
          <section id="portfolio">
            <SectionErrorBoundary sectionName="Портфолио">
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>}>
                <Portfolio />
              </Suspense>
            </SectionErrorBoundary>
          </section>
          
          {/* 4. Почему мы */}
          <SectionErrorBoundary sectionName="Преимущества">
            <Advantages />
          </SectionErrorBoundary>
          
          {/* 5. Кто мы - Lazy loaded */}
          <section id="team">
            <SectionErrorBoundary sectionName="Команда">
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-indigo-500 border-t-transparent rounded-full"></div></div>}>
                <Team />
              </Suspense>
            </SectionErrorBoundary>
          </section>
          
          {/* 6. Форма обратной связи - Lazy loaded */}
          <SectionErrorBoundary sectionName="Контакты">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-indigo-500 border-t-transparent rounded-full"></div></div>}>
              <ContactForm />
            </Suspense>
          </SectionErrorBoundary>
        </main>
        
        <Footer />
      </div>
      
      {/* AI Chat - Lazy loaded */}
      <SectionErrorBoundary sectionName="AI Chat">
        <Suspense fallback={null}>
          <AIChat />
        </Suspense>
      </SectionErrorBoundary>
      <Analytics />
    </div>
  );
}

export default App;

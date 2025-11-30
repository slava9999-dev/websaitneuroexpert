import { useEffect } from "react";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServiceCards from "./components/ServiceCards";
import Portfolio from "./components/Portfolio";
import Advantages from "./components/Advantages";
import Team from "./components/Team";
import ContactForm from "./components/ContactForm";
import AIChat from "./components/AIChat";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import VideoBackground from "./components/VideoBackground";
import Analytics from "./components/Analytics";
import { sendHit } from "./utils/metrika";

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
          <Hero />
          
          {/* 2. Карточки услуг с AI консультация */}
          <ServiceCards />
          
          {/* 3. Портфолио/Кейсы */}
          <section id="portfolio">
            <Portfolio />
          </section>
          
          {/* 4. Почему мы */}
          <Advantages />
          
          {/* 5. Кто мы */}
          <section id="team">
            <Team />
          </section>
          
          {/* 6. Форма обратной связи */}
          <ContactForm />
        </main>
        
        <Footer />
      </div>
      
      <AIChat />
      <Analytics />
    </div>
  );
}

export default App;

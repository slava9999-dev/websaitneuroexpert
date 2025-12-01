import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockServices } from '../mock';
import { X, Send } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { trackGoal } from '../utils/metrika';
import { auditContent, websiteContent, aiAssistantContent, supportContent } from '../data/services';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

const ServiceCards = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);



  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage
      });

      if (response.data.response) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Ошибка отправки сообщения');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <section id="services" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-14 md:mb-16"
          >
            <span className="animated-gradient-text text-glow">Наши услуги</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {mockServices.map((service, index) => (
              <motion.div
                key={service.id}
                id={`service-${service.id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  rotateY: 5,
                  rotateX: 5
                }}
                className="group relative perspective-1000"
              >
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-transparent transition-all duration-500 h-full flex flex-col shadow-lg hover:shadow-2xl">
                  {/* Neon glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7dd3fc] via-[#764ba2] to-[#7dd3fc] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#7dd3fc] group-hover:shadow-[0_0_30px_rgba(125,211,252,0.5)] transition-all duration-500" />
                  
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7dd3fc]/0 via-[#764ba2]/0 to-[#7dd3fc]/0 group-hover:from-[#7dd3fc]/10 group-hover:via-[#764ba2]/10 group-hover:to-[#7dd3fc]/10 transition-all duration-500" />
                  
                  <div className="relative z-10">
                    {/* Animated Icon */}
                    <motion.div 
                      className="text-5xl mb-4"
                      animate={{ 
                        rotateZ: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      {service.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#7dd3fc] transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <div className="text-[#7dd3fc] font-bold text-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                      {service.price}
                    </div>
                    
                    <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow group-hover:text-white/90 transition-colors duration-300">
                      {service.shortDesc}
                    </p>
                    
                    {/* Neon Button */}
                    <motion.button
                      onClick={() => {
                        trackGoal('CTA_SERVICE_CARD', { serviceId: service.id, serviceTitle: service.title });
                        setSelectedService(service);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-full px-6 py-3 bg-gradient-to-r from-[#7dd3fc] to-[#764ba2] text-white font-semibold rounded-xl overflow-hidden group/btn"
                    >
                      <span className="relative z-10">AI консультация</span>
                      
                      {/* Button glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                      
                      {/* Button neon shadow */}
                      <div className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(125,211,252,0.5)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  </div>
                  
                  {/* Particle effect corners */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#7dd3fc] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#764ba2] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0b0f17] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">
                  {selectedService.id === 1 ? auditContent.icon : 
                   selectedService.id === 2 ? aiAssistantContent.icon :
                   selectedService.id === 3 ? websiteContent.icon :
                   selectedService.id === 4 ? supportContent.icon :
                   selectedService.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                    {selectedService.id === 1 ? auditContent.title : 
                     selectedService.id === 2 ? aiAssistantContent.title :
                     selectedService.id === 3 ? websiteContent.title :
                     selectedService.id === 4 ? supportContent.title :
                     selectedService.title}
                  </h2>
                  <p className="text-[#7dd3fc] text-sm sm:text-base">
                    {selectedService.id === 1 ? auditContent.price : 
                     selectedService.id === 2 ? aiAssistantContent.price :
                     selectedService.id === 3 ? websiteContent.price :
                     selectedService.id === 4 ? supportContent.price :
                     selectedService.price}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 pb-48 sm:pb-56 md:pb-64">
                {selectedService.id === 1 && (
                  <>
                    {/* Subtitle */}
                    <div className="mb-8 sm:mb-10 md:mb-12">
                        <p className="text-xl sm:text-xl md:text-2xl text-[#7dd3fc] font-semibold text-center">{auditContent.subtitle}</p>
                    </div>

                    {/* Intro */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#7dd3fc]/20 to-[#764ba2]/20 border border-[#7dd3fc]/30 rounded-lg">
                            <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Что такое цифровой аудит?</h3>
                            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{auditContent.intro.text}</p>
                            
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-white/60 font-semibold mb-2">Без аудита:</p>
                                    <p className="text-white/80">{auditContent.intro.without}</p>
                                </div>
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <p className="text-white/60 font-semibold mb-2">С аудитом:</p>
                                    <p className="text-white/80">{auditContent.intro.with}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Problems */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">💡 Для кого этот аудит?</h3>
                        <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base">Аудит необходим, если вы узнаёте себя в этих ситуациях:</p>
                        <div className="space-y-3">
                            {auditContent.problems.map((problem, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                                >
                                    <span className="text-blue-400 text-xl flex-shrink-0">🎯</span>
                                    <span className="text-white/80">{problem}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* What you get */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Что вы получаете в итоге?</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {auditContent.whatYouGet.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <h4 className="text-xl font-semibold text-[#7dd3fc] mb-3">{item.title}</h4>
                                    <p className="text-white/70">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Approach */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Как проходит процесс?</h3>
                        <div className="space-y-4">
                            {auditContent.approach.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#7dd3fc] rounded-full flex items-center justify-center text-black font-bold">
                                        {idx + 1}
                                    </div>
                                    <span className="text-white/80">{step}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-white/60 mb-6 sm:mb-8 text-base sm:text-lg">Готовы найти точки роста вашего бизнеса?</p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                            <motion.button
                                onClick={() => {
                                    setSelectedService(null);
                                    setTimeout(() => {
                                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 300);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#7dd3fc] to-[#764ba2] text-white font-bold text-base sm:text-lg rounded-xl hover:shadow-2xl hover:shadow-[#7dd3fc]/50 breathing-glow"
                            >
                                📝 ЗАКАЗАТЬ АУДИТ
                            </motion.button>
                            <motion.a
                                href="https://t.me/AineuroRu"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white font-bold text-base sm:text-lg rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.885 8.414l-1.97 9.281c-.148.655-.537.816-1.084.508l-3-2.211-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.585-4.463c.537-.196 1.006.128.831.953z"/>
                                </svg>
                                ЗАДАТЬ ВОПРОС В TELEGRAM
                            </motion.a>
                        </div>
                    </div>
                  </>
                )}

                {/* Website Content */}
                {selectedService.id === 3 && (
                  <>
                    {/* Intro */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#7dd3fc]/20 to-[#764ba2]/20 border border-[#7dd3fc]/30 rounded-lg">
                        <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Что мы создаём? Просто о сложном</h3>
                        <p className="text-white/80 text-base sm:text-lg leading-relaxed">{websiteContent.intro}</p>
                      </div>
                    </section>

                    {/* Types */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Мы создаём digital-продукты трёх типов:</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {websiteContent.types.map((type, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#7dd3fc] transition-all"
                          >
                            <h4 className="text-xl font-semibold text-[#7dd3fc] mb-3">{type.title}</h4>
                            <p className="text-white/70">{type.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Problems */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">💡 Какие задачи мы решаем?</h3>
                      <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base">Типичные ситуации наших клиентов:</p>
                      <div className="space-y-4">
                        {websiteContent.problems.map((problem, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-blue-400 text-xl flex-shrink-0">🎯</span>
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-2">{problem.title}</h4>
                                <p className="text-white/70">{problem.desc}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Approach */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Наш подход: технологии + бизнес-логика</h3>
                      <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8">Мы не просто &quot;рисуем сайты&quot;. Каждый проект — это инженерное решение бизнес-задачи:</p>
                      <div className="space-y-4">
                        {websiteContent.approach.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
                          >
                            <span className="text-green-400 text-xl flex-shrink-0">✅</span>
                            <span className="text-white/80">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-white/60 mb-6 sm:mb-8 text-base sm:text-lg">Готовы начать свой digital-проект?</p>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                        <motion.button
                          onClick={() => {
                            setSelectedService(null);
                            setTimeout(() => {
                              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#7dd3fc] to-[#764ba2] text-white font-bold text-base sm:text-lg rounded-xl hover:shadow-2xl hover:shadow-[#7dd3fc]/50 breathing-glow"
                        >
                          💰 ПОЛУЧИТЬ РАСЧЁТ
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setSelectedService(null);
                            setTimeout(() => {
                              document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white font-bold text-base sm:text-lg rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all"
                        >
                          🎨 ПОРТФОЛИО
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}

                {/* AI Assistant Content */}
                {selectedService.id === 2 && (
                  <>
                    {/* Subtitle */}
                    <div className="mb-8 sm:mb-10 md:mb-12">
                      <p className="text-xl sm:text-xl md:text-2xl text-[#7dd3fc] font-semibold text-center">{aiAssistantContent.subtitle}</p>
                    </div>

                    {/* Intro */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#7dd3fc]/20 to-[#764ba2]/20 border border-[#7dd3fc]/30 rounded-lg">
                        <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Что такое AI-ассистент простыми словами?</h3>
                        {aiAssistantContent.intro.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-white/80 text-lg leading-relaxed mb-4 last:mb-0">{paragraph}</p>
                        ))}
                      </div>
                    </section>

                    {/* Problems and Benefits */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Зачем вашему бизнесу AI-ассистент?</h3>
                      
                      {/* Problems */}
                      <div className="mb-6 sm:mb-8">
                        <p className="text-white/60 mb-4 sm:mb-6 text-base sm:text-lg">🤔 С чем сталкивается бизнес:</p>
                        <div className="space-y-3">
                          {aiAssistantContent.problems.map((problem, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
                            >
                              <span className="text-purple-400 text-xl flex-shrink-0">💬</span>
                              <span className="text-white/80">{problem}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <p className="text-white/60 mb-4 sm:mb-6 text-base sm:text-lg">Что даёт AI-ассистент:</p>
                        <div className="space-y-3">
                          {aiAssistantContent.benefits.map((benefit, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                            >
                              <span className="text-green-400 text-xl flex-shrink-0">✅</span>
                              <span className="text-white/80">{benefit}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Scenarios */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Как работает AI-ассистент? Простыми словами</h3>
                      <div className="space-y-8">
                        {aiAssistantContent.scenarios.map((scenario, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-white/5 rounded-lg border border-white/10"
                          >
                            <h4 className="text-2xl font-semibold text-[#7dd3fc] mb-6">{scenario.title}</h4>
                            
                            {/* Without AI */}
                            <div className="mb-6">
                              <p className="text-white/60 font-semibold mb-3">Без AI:</p>
                              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-white/80">{scenario.without}</p>
                              </div>
                            </div>

                            {/* With AI */}
                            <div className="mb-6">
                              <p className="text-white/60 font-semibold mb-3">С AI-ассистентом:</p>
                              <div className="space-y-2">
                                {scenario.with.map((step, stepIdx) => (
                                  <div key={stepIdx} className="flex items-start gap-3 p-3 bg-[#7dd3fc]/10 rounded-lg">
                                    <div className="flex-shrink-0 w-6 h-6 bg-[#7dd3fc] rounded-full flex items-center justify-center text-black font-bold text-sm">
                                      {stepIdx + 1}
                                    </div>
                                    <span className="text-white/80">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Result */}
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <p className="text-white/60 font-semibold mb-2">Результат:</p>
                              <p className="text-white/80">{scenario.result}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-white/60 mb-6 sm:mb-8 text-base sm:text-lg">Готовы автоматизировать работу с клиентами?</p>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                        <motion.button
                          onClick={() => {
                            setSelectedService(null);
                            setTimeout(() => {
                              // Открываем AI Chat
                              const aiChatButton = document.querySelector('button[data-ai-chat-button="true"]');
                              if (aiChatButton) {
                                aiChatButton.click();
                              }
                            }, 300);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#7dd3fc] to-[#764ba2] text-white font-bold text-base sm:text-lg rounded-xl hover:shadow-2xl hover:shadow-[#7dd3fc]/50 breathing-glow flex items-center justify-center gap-2"
                        >
                          <span className="text-2xl">💬</span>
                          <span>ЗАПУСТИТЬ AI-АССИСТЕНТА</span>
                        </motion.button>
                      </div>
                      <p className="text-white/40 text-sm mt-4">
                        ✨ Получите консультацию прямо сейчас
                      </p>
                    </div>
                  </>
                )}

                {/* Support Content */}
                {selectedService.id === 4 && (
                  <>
                    {/* Subtitle */}
                    <div className="mb-8 sm:mb-10 md:mb-12">
                      <p className="text-xl sm:text-xl md:text-2xl text-[#7dd3fc] font-semibold text-center">{supportContent.subtitle}</p>
                    </div>

                    {/* Intro */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#7dd3fc]/20 to-[#764ba2]/20 border border-[#7dd3fc]/30 rounded-lg">
                        <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Что такое техподдержка простыми словами?</h3>
                        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{supportContent.intro.text}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-white/60 font-semibold mb-2">Без техподдержки:</p>
                            <p className="text-white/80">{supportContent.intro.without}</p>
                          </div>
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-white/60 font-semibold mb-2">С техподдержкой:</p>
                            <p className="text-white/80">{supportContent.intro.with}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Real Stories */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Реальные истории клиентов, которые отказались от поддержки</h3>
                      <div className="space-y-6">
                        {supportContent.stories.map((story, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-white/5 rounded-lg border border-white/10"
                          >
                            <h4 className="text-xl font-semibold text-[#7dd3fc] mb-4">История {idx + 1}: {story.title}</h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-white/60 font-semibold">Проблема: </span>
                                <span className="text-white/80">{story.problem}</span>
                              </div>
                              {story.consequences && (
                                <div>
                                  <span className="text-white/60 font-semibold">Последствия: </span>
                                  <span className="text-white/80">{story.consequences}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-white/60 font-semibold">Причина: </span>
                                <span className="text-white/80">{story.reason}</span>
                              </div>
                              <div className="pt-3 border-t border-white/10">
                                <span className="text-red-400 font-semibold">Потери: </span>
                                <span className="text-red-400">{story.losses}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Problems */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">⚡ Риски работы без техподдержки</h3>
                      <div className="space-y-3">
                        {supportContent.problems.map((problem, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                          >
                            <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                            <span className="text-white/80">{problem}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Packages */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Пакеты технической поддержки</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {supportContent.packages.map((pkg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-lg border ${pkg.recommended ? 'bg-[#7dd3fc]/10 border-[#7dd3fc]' : 'bg-white/5 border-white/10'}`}
                          >
                            <div className="text-center mb-6">
                              <div className="text-4xl mb-2">{pkg.emoji}</div>
                              <h4 className="text-2xl font-bold text-white mb-2">{pkg.name}</h4>
                              <div className="text-3xl font-bold text-[#7dd3fc] mb-2">{pkg.price}</div>
                              <p className="text-white/60 text-sm">{pkg.forWhom}</p>
                              {pkg.recommended && (
                                <div className="mt-3 inline-block px-3 py-1 bg-[#7dd3fc] text-black text-xs font-bold rounded-full">
                                  РЕКОМЕНДУЕМ
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 mb-6">
                              {pkg.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-2 text-sm">
                                  <span className="text-green-400 flex-shrink-0">✅</span>
                                  <span className="text-white/80">{feature}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
                              <div>
                                <span className="text-white/60">Реакция: </span>
                                <span className="text-[#7dd3fc] font-semibold">{pkg.sla.reaction}</span>
                              </div>
                              <div>
                                <span className="text-white/60">Uptime: </span>
                                <span className="text-[#7dd3fc] font-semibold">{pkg.sla.uptime}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* ROI */}
                    <section className="mb-8 sm:mb-10 md:mb-12">
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Ожидаемая экономия: ROI техподдержки</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <h4 className="text-xl font-semibold text-white mb-4">Без техподдержки (типичный год)</h4>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span className="text-white/70">Простои:</span>
                              <span className="text-white">{supportContent.roi.withoutSupport.downtime.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Взлом:</span>
                              <span className="text-white">{supportContent.roi.withoutSupport.hack.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Баги:</span>
                              <span className="text-white">{supportContent.roi.withoutSupport.bugs.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Срочный ремонт:</span>
                              <span className="text-white">{supportContent.roi.withoutSupport.emergency.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Потеря данных:</span>
                              <span className="text-white">{supportContent.roi.withoutSupport.dataLoss.toLocaleString()} ₽</span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-red-500/20">
                            <div className="flex justify-between text-lg font-bold">
                              <span className="text-white">Итого убытков:</span>
                              <span className="text-red-400">{supportContent.roi.withoutSupport.total.toLocaleString()} ₽</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <h4 className="text-xl font-semibold text-white mb-4">С техподдержкой (Стандартный пакет)</h4>
                          <div className="space-y-4 mb-4">
                            <div>
                              <span className="text-white/70">Предотвращено убытков:</span>
                              <div className="text-2xl font-bold text-green-400">{supportContent.roi.withSupport.saved.toLocaleString()} ₽</div>
                            </div>
                            <div>
                              <span className="text-white/70">Стоимость подписки за год:</span>
                              <div className="text-xl text-white">{supportContent.roi.withSupport.cost.toLocaleString()} ₽</div>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-green-500/20 space-y-2">
                            <div className="flex justify-between text-lg font-bold">
                              <span className="text-white">Экономия:</span>
                              <span className="text-green-400">{supportContent.roi.withSupport.profit.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                              <span className="text-white">ROI:</span>
                              <span className="text-[#7dd3fc]">+{supportContent.roi.withSupport.roi}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-white/60 mb-3 sm:mb-4 text-sm sm:text-base">🎁 Первый месяц — тестовый со скидкой 50%!</p>
                      <p className="text-white/60 mb-6 sm:mb-8 text-base sm:text-lg">Убедитесь, что это работает, прежде чем платить полную стоимость</p>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                        <motion.button
                          onClick={() => {
                            setSelectedService(null);
                            setTimeout(() => {
                              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#7dd3fc] to-[#764ba2] text-white font-bold text-base sm:text-lg rounded-xl hover:shadow-2xl hover:shadow-[#7dd3fc]/50 breathing-glow"
                        >
                          🛡️ ПОДКЛЮЧИТЬ ПОДДЕРЖКУ
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AI Chat at bottom - Fixed */}
            <div className="flex-shrink-0 bg-[#121826] border-t border-white/10 p-4">
              <div className="max-w-5xl mx-auto">
                {/* Chat Messages */}
                {chatMessages.length > 0 && (
                  <div className="mb-4 max-h-40 overflow-y-auto space-y-2">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-[#7dd3fc] text-black'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Задайте вопрос AI-ассистенту..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none pr-10"
                      disabled={chatLoading}
                    />
                    {chatInput && (
                      <button
                        onClick={() => setChatInput('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-white/60" />
                      </button>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={chatLoading}
                    className="px-6 py-2 bg-[#7dd3fc] text-black rounded-none hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCards;

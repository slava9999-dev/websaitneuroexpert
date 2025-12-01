import React from 'react';
import { motion } from 'framer-motion';
import { mockPortfolio } from '../mock';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7dd3fc]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#764ba2]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="animated-gradient-text text-glow">Наши кейсы</span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Реальные результаты внедрения наших решений в бизнес клиентов
          </motion.p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {[
            { value: '50+', label: 'Завершенных проектов' },
            { value: '98%', label: 'Довольных клиентов' },
            { value: '300%+', label: 'Средний ROI' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#7dd3fc]/20 to-[#764ba2]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                <div className="text-5xl sm:text-6xl font-bold mb-3">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7dd3fc] to-[#764ba2]">
                    {stat.value}
                  </span>
                </div>
                <div className="text-white/70 text-lg font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPortfolio.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col h-full"
            >
              {/* Card Background & Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3fc]/0 via-[#764ba2]/0 to-[#7dd3fc]/0 group-hover:from-[#7dd3fc]/10 group-hover:via-[#764ba2]/10 group-hover:to-[#7dd3fc]/10 rounded-3xl transition-all duration-500 blur-xl" />
              
              <div className="relative flex flex-col h-full bg-[#121826]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group-hover:border-[#7dd3fc]/30 transition-all duration-300 shadow-lg group-hover:shadow-[#7dd3fc]/20">
                {/* Top Gradient Line */}
                <div className={`h-2 w-full bg-gradient-to-r ${project.gradient}`} />

                <div className="p-8 flex flex-col flex-grow">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      {project.icon}
                    </div>
                    {project.link !== '#' && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold text-white mb-2 group-hover:text-[#7dd3fc] transition-colors ${
                      project.id === 2 ? 'md:text-3xl md:animated-gradient-text md:font-extrabold' : ''
                    }`}>
                      {project.title}
                    </h3>
                    <p className="text-[#7dd3fc] font-medium text-sm mb-4">
                      {project.company}
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.services.map((service, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-3 py-1 bg-white/5 text-white/70 text-xs font-medium rounded-full border border-white/10 group-hover:border-[#7dd3fc]/30 transition-colors"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Spacer */}
                  <div className="mt-auto" />

                  {/* Metrics */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-[#7dd3fc]">{project.result}</span>
                      <span className="text-white/50 text-xs uppercase tracking-wider">Рост</span>
                    </div>
                    <div className="text-white/80 text-sm">{project.metric}</div>
                  </div>

                  {/* Testimonial */}
                  <div className="mb-6 pl-4 border-l-2 border-[#764ba2]/50 italic text-white/50 text-sm">
                    "{project.testimonial}"
                  </div>

                  {/* Action Button */}
                  {project.link !== '#' ? (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#7dd3fc] to-[#764ba2] text-white font-bold shadow-lg shadow-[#7dd3fc]/20 group-hover:shadow-[#7dd3fc]/40 transition-all"
                    >
                      <span>Смотреть кейс</span>
                      <ArrowUpRight size={18} />
                    </motion.a>
                  ) : (
                    <div className="w-full py-4 rounded-xl bg-white/5 text-white/30 font-semibold text-center border border-white/5 cursor-not-allowed">
                      В разработке
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
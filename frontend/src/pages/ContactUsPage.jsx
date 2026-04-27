import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Send, User, Twitter, Facebook, Linkedin, Youtube, Twitch, Github } from 'lucide-react';
import PageTransition from '../components/PageTransition';

import { messageApi } from '../lib/api';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await messageApi.submit(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', contactNumber: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between">
        {/* Main Content Area */}
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink dark:text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">
              Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below and our team will be in touch shortly.
            </p>
          </div>

          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 p-8 shadow-soft backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/40 sm:p-10">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <div className="mb-6 rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-ink dark:text-white">Message Sent!</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 rounded-full bg-brand-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-accent/90"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 text-brand-ink transition placeholder:text-slate-400 focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-accent dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 text-brand-ink transition placeholder:text-slate-400 focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-accent dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Contact Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      required
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 text-brand-ink transition placeholder:text-slate-400 focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-accent dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-slate-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full resize-none rounded-2xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 text-brand-ink transition placeholder:text-slate-400 focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-accent dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-accent px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer Area matching reference image */}
        <footer className="w-full border-t border-slate-200 bg-slate-50 py-6 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 sm:gap-6">
              <span className="font-medium text-slate-600 dark:text-slate-300">© 2026 CityExplorer, Inc.</span>
            </div>

            <div className="flex items-center gap-5 text-slate-400">

              <a href="#" className="transition hover:text-slate-600 dark:hover:text-slate-300" aria-label="Facebook">
                <Facebook className="h-5 w-5 fill-current" />
              </a>
              <a href="#" className="transition hover:text-slate-600 dark:hover:text-slate-300" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 fill-current" />
              </a>

              <a href="#" className="transition hover:text-slate-600 dark:hover:text-slate-300" aria-label="GitHub">
                <Github className="h-5 w-5 fill-current" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

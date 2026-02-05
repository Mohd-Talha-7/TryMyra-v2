import React, { useState, useEffect } from 'react';
import { Zap, Menu, X, LayoutDashboard } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useClerk } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import StylishConfirmModal from './StylishConfirmModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { signOut } = useClerk();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (targetId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <Zap size={18} fill="white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              trymyra
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="text-slate-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest hover:-translate-y-0.5"
              >
                Features
              </a>
              <a
                href="#workflow"
                onClick={(e) => handleSmoothScroll(e, 'workflow')}
                className="text-slate-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest hover:-translate-y-0.5"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleSmoothScroll(e, 'pricing')}
                className="text-slate-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest hover:-translate-y-0.5"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => handleSmoothScroll(e, 'faq')}
                className="text-slate-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest hover:-translate-y-0.5"
              >
                FAQ's
              </a>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="bg-primary hover:bg-primaryDark text-white px-7 py-3 rounded-xl text-sm font-black transition-all shadow-[0_4px_20px_0_rgba(47,107,255,0.4)] hover:scale-105 active:scale-95 uppercase tracking-wider"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 hover:text-white text-slate-400 transition-colors mr-4"
                >
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-bold">Dashboard</span>
                </Link>
                <UserButton appearance={{
                  elements: {
                    userButtonPopoverFooter: "hidden",
                    userButtonPopoverActionButton__signOut: "hidden"
                  }
                }}>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Sign out"
                      labelIcon={<span className="material-symbols-outlined text-[18px]">logout</span>}
                      onClick={() => setIsLogoutModalOpen(true)}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-8 space-y-4">
          <a
            href="#features"
            onClick={(e) => handleSmoothScroll(e, 'features')}
            className="text-slate-300 hover:text-white block px-3 py-4 rounded-xl text-lg font-bold uppercase tracking-widest border-b border-white/5"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={(e) => handleSmoothScroll(e, 'workflow')}
            className="text-slate-300 hover:text-white block px-3 py-4 rounded-xl text-lg font-bold uppercase tracking-widest border-b border-white/5"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleSmoothScroll(e, 'pricing')}
            className="text-slate-300 hover:text-white block px-3 py-4 rounded-xl text-lg font-bold uppercase tracking-widest border-b border-white/5"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => handleSmoothScroll(e, 'faq')}
            className="text-slate-300 hover:text-white block px-3 py-4 rounded-xl text-lg font-bold uppercase tracking-widest border-b border-white/5"
          >
            FAQ's
          </a>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full text-center bg-primary text-white block px-3 py-5 rounded-xl text-lg font-black uppercase tracking-widest shadow-xl">
                Get the App
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="text-center bg-primary text-white block px-3 py-5 rounded-xl text-lg font-black uppercase tracking-widest shadow-xl mb-3"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>

      <StylishConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => signOut()}
        title="Sign Out"
        message="Are you sure you want to log out of your account?"
        type="danger"
      />
    </nav>
  );
};
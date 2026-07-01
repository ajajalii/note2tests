import React, { useEffect, useState } from 'react';
import { Menu, UserRound, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/notetotest.png';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateNavbar = () => {
      setIsScrolled(window.scrollY > 40);
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    return () => window.removeEventListener('scroll', updateNavbar);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
  ];

  const ctaPath = user ? '/upload' : '/?from=get-started';
  const ctaLabel = user ? 'Create Quiz' : 'Get Started';

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 px-4 transition-all duration-500 ease-out ${
          isScrolled ? 'top-4' : 'top-0'
        }`}
      >
        <nav
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
            isScrolled
              ? 'max-w-4xl rounded-full border border-white/60 bg-white/45 px-4 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-white/35 backdrop-blur-2xl'
              : 'max-w-7xl rounded-none border border-transparent bg-transparent px-2 py-5 shadow-none'
          }`}
        >
          <button
            type="button"
            className={`group flex min-w-0 items-center rounded-full transition-colors ${
              isScrolled ? 'px-2 py-1.5 hover:bg-white/35' : 'px-0 py-1'
            }`}
            onClick={() => goTo('/')}
            aria-label="Go to home"
          >
            <img
              src={logo}
              alt="Note2Test"
              className={`object-contain transition-all duration-500 ${
                isScrolled ? 'h-11 w-36' : 'h-12 w-40'
              }`}
              draggable={false}
            />
          </button>

          <div className="hidden items-center justify-end gap-5 md:flex">
            {user && (
              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-white/35 hover:text-slate-950"
                aria-label="Profile"
              >
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}

            <div
              className={`flex items-center gap-6 text-sm font-semibold transition-colors ${
                isScrolled ? 'text-slate-800' : 'text-slate-700'
              }`}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className={`relative rounded-full px-1 py-2 transition-colors ${
                      isActive ? 'text-slate-950' : 'hover:text-slate-950'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => goTo(ctaPath)}
              // className="group flex h-11 items-center gap-3 rounded-[8px] bg-[#141418] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              className="group flex h-11 items-center gap-3 rounded-[8px] bg-[#141418] px-5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <span>{ctaLabel}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 transition-colors duration-300 group-hover:bg-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-5-5 5 5-5 5"
                  />
                </svg>
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition-colors hover:bg-slate-800 md:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="mx-auto mt-3 max-w-4xl rounded-2xl border border-white/60 bg-white/70 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)] ring-1 ring-white/35 backdrop-blur-2xl md:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => goTo(item.path)}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    location.pathname === item.path
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user && (
                <button
                  type="button"
                  onClick={() => goTo('/profile')}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  {user.first_name || user.username}
                </button>
              )}
              <button
                type="button"
                onClick={() => goTo(ctaPath)}
                className="rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-bold text-white transition-colors hover:bg-slate-800"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="h-20 md:h-24" aria-hidden="true" />
    </>
  );
};

export default Navbar;

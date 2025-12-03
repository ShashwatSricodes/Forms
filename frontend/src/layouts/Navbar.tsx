import { useState, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MorphyLogo from "@/assets/Morphyb.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  // ✅ Smooth scroll handler for "Features"
  const handleScrollToFeatures = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("features");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("features");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  // ✅ Smooth scroll handler for "Pricing"
  const handleScrollToPricing = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <section className="my-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={MorphyLogo}
              alt="Morphy Logo"
              className="h-8 md:h-9 w-auto object-contain translate-y-[1px]"
              loading="lazy"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-gray-700 transition-colors">
              Home
            </Link>
            <button
              onClick={handleScrollToFeatures}
              className="text-sm font-medium hover:text-gray-700 transition-colors"
            >
              Features
            </button>
            <Link to="/dashboard" className="text-sm font-medium hover:text-gray-700 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={handleScrollToPricing}
              className="text-sm font-medium hover:text-gray-700 transition-colors"
            >
              Pricing
            </button>
            <Link to="/contact" className="text-sm font-medium hover:text-gray-700 transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            {!isLoggedIn ? (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Start for free</Link>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                className="bg-[#333333] text-white hover:bg-[#1a1a1a]"
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <img
                      src={MorphyLogo}
                      alt="Morphy Logo"
                      className="h-8 md:h-9 w-auto object-contain translate-y-[1px]"
                      loading="lazy"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-6 space-y-6">
                <Link to="/" className="text-base font-medium hover:text-gray-700">
                  Home
                </Link>
                <button
                  onClick={handleScrollToFeatures}
                  className="text-base font-medium hover:text-gray-700 text-left"
                >
                  Features
                </button>
                <Link to="/dashboard" className="text-base font-medium hover:text-gray-700">
                  Dashboard
                </Link>
                <button
                  onClick={handleScrollToPricing}
                  className="text-base font-medium hover:text-gray-700 text-left"
                >
                  Pricing
                </button>
                <Link to="/contact" className="text-base font-medium hover:text-gray-700">
                  Contact
                </Link>

                <div className="mt-6 flex flex-col gap-4">
                  {!isLoggedIn ? (
                    <>
                      <Button asChild variant="outline">
                        <Link to="/login">Sign in</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/signup">Start for Free</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleLogout}
                      className="bg-[#333333] text-white hover:bg-[#1a1a1a]"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export default Navbar;

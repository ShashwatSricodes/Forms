import { useState, useEffect } from "react"; 
import { MenuIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  const features = [
    { title: "Dashboard", description: "Overview of your activity", href: "/dashboard" },
    { title: "Analytics", description: "Track your performance", href: "/analytics" },
    { title: "Settings", description: "Configure your preferences", href: "/settings" },
    { title: "Integrations", description: "Connect with other tools", href: "/integrations" },
    { title: "Storage", description: "Manage your files", href: "/storage" },
    { title: "Support", description: "Get help when needed", href: "/support" },
  ];

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authChange")); // immediately update Navbar
    navigate("/login");
  };

  return (
    <section className="my-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="max-h-8"
              alt="Logo"
            />
            <span className="text-lg font-semibold tracking-tighter">MyApp</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, i) => (
                      <NavigationMenuLink
                        key={i}
                        asChild
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <Link to={feature.href}>
                          <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {["/dashboard", "/resources", "/contact"].map((path) => {
                const label = path.replace("/", "");
                const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <NavigationMenuItem key={path}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link to={path}>{capitalized}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

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
                className="bg-black text-white hover:bg-zinc-800"
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Sheet */}
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
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                      className="max-h-8"
                      alt="Logo"
                    />
                    <span className="text-lg font-semibold tracking-tighter">MyApp</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, i) => (
                          <Link
                            key={i}
                            to={feature.href}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex flex-col gap-6">
                  <Link to="/dashboard" className="font-medium">
                    Dashboard
                  </Link>
                  <Link to="/blog" className="font-medium">
                    Blog
                  </Link>
                  <Link to="/pricing" className="font-medium">
                    Pricing
                  </Link>
                </div>

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
                      className="bg-black text-white hover:bg-zinc-800"
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

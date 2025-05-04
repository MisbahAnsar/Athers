import { Menu, Github } from "lucide-react";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
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
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JSX } from "react/jsx-runtime";
import Image from "next/image";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/logo4.png",
    alt: "logo",
    title: "Athers",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "About",
      url: "/"
    },
    {
      title: "Pricing",
      url: "/",
    },
  ],
  mobileExtraLinks = [
    { name: "Contact", url: "/" },
    { name: "Karess", url: "https://karess69.vercel.app" },
    { name: "GitHub", url: "https://github.com/MisbahAnsar/Ather" },
    { name: "Discord", url: "https://discord.gg/dK7rfcQGkC" },
  ],
  auth = {
    login: { text: "Sign in", url: "/" },
    signup: { text: "Sign up", url: "/" },
  },
}: Navbar1Props) => {
  return (
    <section className="py-4 px-2 lg:px-0 flex items-center justify-center">
      <div className="container max-w-7xl">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center">
              <Image height={100} width={100} src={logo.src} className="w-8" alt={logo.alt} />
              <span className="text-2xl uppercase ibm-plex-mono-medium tracking-tighter">{logo.title}</span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <a
                href="https://github.com/MisbahAnsar/Ather"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-accent-foreground"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://discord.gg/dK7rfcQGkC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-accent-foreground"
              >
                <DiscordLogoIcon className="h-6 w-6" />
              </a>
            </div>
            <div className="flex gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="text-lg ibm-plex-mono-regular" variant="outline" size="lg">
                    {auth.login.text}
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="text-lg ibm-plex-mono-regular" size="lg">{auth.signup.text}</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <Image width={100} height={100} src={logo.src} className="w-8" alt={logo.alt} />
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <Image width={100} height={100} src={logo.src} className="w-8" alt={logo.alt} />
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <a
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                          target={link.name === "GitHub" || link.name === "Discord" ? "_blank" : "_self"}
                          rel={link.name === "GitHub" || link.name === "Discord" ? "noopener noreferrer" : ""}
                        >
                          {link.name === "GitHub" && <Github className="h-4 w-4" />}
                          {link.name === "Discord" && <DiscordLogoIcon className="h-4 w-4" />}
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button variant="outline">{auth.login.text}</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button>{auth.signup.text}</Button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <div className="flex justify-center sm:justify-normal">
                        <UserButton
                          appearance={{
                            elements: {
                              userButtonAvatarBox: "w-10 h-10",
                            },
                          }}
                        />
                      </div>
                    </SignedIn>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-lg uppercase ibm-plex-mono-regular text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar1 };
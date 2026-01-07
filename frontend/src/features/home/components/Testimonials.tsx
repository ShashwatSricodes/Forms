import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Testimonial data remains the same
const testimonials = [
  {
    name: "John Doe",
    title: "CEO & Founder",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    quote: "Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat.",
  },
  {
    name: "Jane Doe",
    title: "CTO",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    quote: "Working with them was a game-changer. The results speak for themselves.",
  },
  {
    name: "John Smith",
    title: "COO",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    quote: "The team's dedication and expertise are unmatched. Highly recommended!",
  },
  {
    name: "Gordon Doe",
    title: "Developer",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    quote: "Incredible attention to detail and a seamless development process. A pleasure to work with.",
  },
  {
    name: "Emily White",
    title: "Marketing Head",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    quote: "Their strategic insights helped us double our user engagement in just one quarter.",
  },
  {
    name: "Michael Brown",
    title: "Product Manager",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
    quote: "A truly collaborative partner. They took our vision and brought it to life flawlessly.",
  },
];

export default function Testimonials() {
  const navigate = useNavigate();

  return (
    <>
      {/* Scoped CSS for animation */}
      <style>
        {`
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.5rem));
          }
        }
        .animate-scroller {
          animation: scroll 40s linear infinite;
        }
        .group:hover .animate-scroller {
          animation-play-state: paused;
        }
      `}
      </style>

      <section className="py-20">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h1 className="text-4xl font-normal tracking-tighter sm:text-5xl md:text-6xl">
              Meet our happy clients
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              All of our 1000+ clients are happy
            </p>

            {/* CLICK → GO TO DASHBOARD */}
            <Button onClick={() => navigate("/dashboard")}>
              Get started for free
            </Button>
          </div>

          {/* Animated Scroller */}
          <div
            className="relative flex overflow-x-hidden group"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
            }}
          >
            <div className="flex animate-scroller">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card
                  key={index}
                  className="w-80 mx-2 flex-shrink-0 md:w-96 md:mx-4"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

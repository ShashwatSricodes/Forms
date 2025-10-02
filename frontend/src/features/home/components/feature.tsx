import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Monitor,
  Layers,
  Zap,
  Wand2,
  Settings,
  Infinity,
} from "lucide-react";

const features = [
  {
    title: "Quality",
    description:
      "Our UI blocks are designed with quality in mind. Every block is pixel perfect and visually appealing.",
    icon: Wand2,
  },
  {
    title: "Customizable",
    description:
      "Easily customize our UI blocks to fit your needs. Change colors, fonts, and more with our easy-to-use interface.",
    icon: Settings,
  },
  {
    title: "Responsive",
    description:
      "Our UI blocks are fully responsive and look great on any device, no matter the screen size.",
    icon: Monitor,
  },
  {
    title: "Easy to Use",
    description:
      "Drag and drop the blocks you want — no coding knowledge required. Super easy and intuitive.",
    icon: Layers,
  },
  {
    title: "Fast",
    description:
      "Our UI blocks are optimized for performance. Your website will load fast and provide a great user experience.",
    icon: Zap,
  },
  {
    title: "Modern",
    description:
      "Designed with modern trends in mind. Your website will look fresh, clean, and up-to-date.",
    icon: Infinity,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="w-full py-16 px-6 mt-15">
      <div className="max-w-6xl mx-auto">
       <h2 className="text-4xl sm:text-5xl font-normal tracking-tighter mb-20 text-center">
          The simplest way to build{" "}
          <span className="relative inline-block">
            forms
            {/* Wavy underline SVG */}
            <svg
              className="absolute left-0 -bottom-2 w-full h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 0,5 Q 25,0 50,5 T 100,5"
                stroke="#BEDBFF"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-2xl border border-gray-200 p-6 shadow-none transition"
            >
              <CardHeader className="p-0 mb-4">
                <feature.icon className="h-6 w-6 mb-3 text-primary" />
                <CardTitle className="text-xl font-medium tracking-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
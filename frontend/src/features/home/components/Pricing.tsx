import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const features = [
  "Unlimited forms",
  "Basic form analytics",
  "Secure data storage",
  "Responsive layouts",
  "Email support",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-normal tracking-tighter mb-4">
          Simple,{" "}
          <span className="relative inline-block">
            Transparent
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
                stroke="#FFF085"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          pricing
        </h2>

        <p className="text-muted-foreground mb-12 text-base">
          Start building forms with everything you need — free forever.
        </p>

        {/* Card */}
        <Card className="mx-auto max-w-md border border-gray-200 rounded-2xl shadow-none">
          <CardHeader className="pb-2 pt-8">
            <CardTitle className="text-2xl font-medium">Free</CardTitle>
            <div className="mt-3 mb-1">
              <span className="text-6xl font-bold text-gray-900">$0</span>
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              For individuals and small projects
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <ul className="space-y-3 text-left">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-[#333333]" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="pb-8 pt-0">
            <Button
              variant="default"
              className="w-full bg-[#333333] text-white hover:bg-[#1a1a1a] rounded-xl transition-colors"
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

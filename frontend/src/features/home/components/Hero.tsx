import { Star } from "lucide-react";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Hero7Props {
  heading?: React.ReactNode;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero7 = ({
  heading = (
    <>
      Forms reimagined for{" "}
      {/* UPDATED: Nested spans to keep text straight and box slanted */}
      <span className="inline-block -rotate-2 rounded-sm bg-yellow-200 px-2">
        <span className="inline-block rotate-2 text-black">simplicity</span>
      </span>{" "}
      and{" "}
      <span className="inline-block -rotate-2 rounded-sm bg-blue-200 px-2">
        <span className="inline-block rotate-2 text-black">design</span>
      </span>
    </>
  ),
  description = "Create, share, and collect responses with clean, minimal forms — no clutter, no fuss.",
  button = {
    text: "Create your first form",
    url: "https://www.shadcnblocks.com",
  },
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp", alt: "Avatar 1" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp", alt: "Avatar 2" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp", alt: "Avatar 3" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp", alt: "Avatar 4" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp", alt: "Avatar 5" },
    ],
  },
}: Hero7Props) => {
  return (
    <section className="py-32">
      <div className="container text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h1 className="font-['DM_Sans'] text-3xl font-medium lg:text-6xl">
            {heading}
          </h1>
          <p className="text-muted-foreground text-balance lg:text-lg">
            {description}
          </p>
        </div>
        <Button asChild size="lg" className="mt-10">
          <a href={button.url}>{button.text}</a>
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="mr-1 font-semibold">
                {reviews.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-muted-foreground text-left font-medium">
              from {reviews.count}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero7;
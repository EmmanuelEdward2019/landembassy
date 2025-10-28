import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  property: string;
  text: string;
  image?: string;
}

export default function TestimonialCard({
  name,
  property,
  text,
  image,
}: TestimonialCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-6 relative">
      <Quote className="h-10 w-10 text-primary/20 mb-4" />
      <p className="text-muted-foreground italic mb-6 font-serif text-lg">
        "{text}"
      </p>
      <div className="flex items-center gap-3">
        <Avatar>
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{property}</p>
        </div>
      </div>
    </Card>
  );
}

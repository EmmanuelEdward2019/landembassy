import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  publishedAt: string;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  category,
  image,
  author,
  publishedAt,
}: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-blog-${id}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{publishedAt}</span>
          </div>
        </div>
        <Link href={`/blog/${id}`}>
          <button className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
            Read More <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </Card>
  );
}

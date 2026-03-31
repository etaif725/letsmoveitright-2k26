import { Link } from "react-router-dom";
import type { BlogPost } from "@/data/blog-posts";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg sm:flex">
      {/* Thumbnail */}
      {post.image && (
        <Link
          to={post.href}
          className="block shrink-0 overflow-hidden sm:w-56 md:w-64"
        >
          <img
            src={post.image}
            alt={post.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-full"
          />
        </Link>
      )}

      {/* Text */}
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <h2 className="font-heading text-lg text-heading md:text-xl">
          <Link to={post.href} className="text-heading hover:text-link">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">
          {post.excerpt}
        </p>
        <Link
          to={post.href}
          className="mt-4 inline-block text-sm font-bold uppercase text-link hover:text-link-hover"
        >
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
}

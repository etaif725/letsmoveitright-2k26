import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import Sidebar from "@/components/layout/Sidebar";
import BlogPostCard from "@/components/ui/BlogPostCard";
import PromoBanner from "@/components/ui/PromoBanner";
import { SEO } from "@/data/seo";
import { BLOG_POSTS } from "@/data/blog-posts";

export default function BlogPage() {
  return (
    <>
      <Seo {...SEO.blog} />
      <PageTitle title="Moving Blog" subtitle="TIPS AND TRICKS TO EASE THE STRESS OF YOUR MOVE" />
      <PromoBanner />
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {BLOG_POSTS.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
          <Sidebar />
        </div>
      </section>
    </>
  );
}

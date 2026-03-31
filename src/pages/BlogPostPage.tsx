import { useParams, Navigate } from "react-router-dom";
import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import Sidebar from "@/components/layout/Sidebar";
import PromoBanner from "@/components/ui/PromoBanner";
import { getPostBySlug } from "@/data/blog-posts";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <>
      <Seo
        title={post.seoTitle}
        description={post.seoDescription}
        canonical={post.canonical}
      />
      <PageTitle title={post.title} subtitle={post.subtitle} />
      
      {/* CTA below the article */}
      <PromoBanner />

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Featured image */}
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="mb-8 w-full rounded-lg object-cover shadow-sm"
              />
            )}

            {/* Article content */}
            <article
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <Sidebar />
        </div>
      </section>
    </>
  );
}

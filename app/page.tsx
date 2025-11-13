import prisma from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { NewsletterSection } from "@/components/newsletter-section";
import { AdSlot } from "@/components/ad-slot";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Sparkzonn - Premium Tech & Lifestyle Blog",
  description:
    "Discover insightful articles about technology, lifestyle, and innovation",
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function Home() {
  const [topFeaturedArticles, topPosts] = await Promise.all([
    prisma.blog.findMany({
      where: { published: true, featured: true, coverImage: { not: null } },
      take: 2,
      include: {
        category: { select: { name: true, slug: true } },
        comments: true,
      },
    }),
    prisma.blog.findMany({
      where: { published: true, coverImage: { not: null } },
      take: 10,
      include: {
        category: { select: { name: true, slug: true } },
        comments: true,
      },
      orderBy: { likes: "desc" },
    }),
  ]);

  const allPosts = [
    ...new Map(
      [...topFeaturedArticles, ...topPosts].map((p) => [p.id, p])
    ).values(),
  ];
  const sortedPosts = allPosts.sort(
    (a, b) => b.likes + b.comments.length - (a.likes + a.comments.length)
  );

  const featuredPosts = sortedPosts.filter((post) => post.featured).slice(0, 2);
  const trendingPosts = sortedPosts.slice(0, 5);
  const carouselPosts = shuffleArray(sortedPosts);

  return (
    <>
      <Header />
      <main className="bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdSlot position="HEADER" />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-primary/5 py-20 sm:py-32 lg:py-40 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Curated Insights & Stories
                </span>
              </div>

              <div className="space-y-4 max-w-3xl">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  Discover Insights That
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                    {" "}
                    Matter
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl">
                  Explore thought-provoking articles on technology, lifestyle,
                  and innovation from industry experts and creators.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/blog">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Link href="#newsletter">Subscribe</Link>
                </Button>
              </div>
            </div>
            {carouselPosts.length > 0 && (
              <Carousel className="mt-12 w-full lg:w-1/2">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {carouselPosts.map((post) => (
                    <CarouselItem key={post.id} className="pl-2 md:pl-4 ">
                      <div className="bg-card rounded-lg overflow-hidden shadow-sm border relative">
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full object-cover h-full"
                          />
                        )}
                        <div className="p-4 absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/40 to-transparent">
                          <Button asChild size="sm" className="mt-3">
                            <Link href={`/blog/${post.slug}`}>Read More</Link>
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* posito btoom */}
                <div className="absolute -translate-x-1/2 -bottom-5 right-1/2 flex gap-2">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            )}
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="space-y-12">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Featured Stories
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-balance">
                  Our Most Compelling Articles
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.excerpt,
                      coverImage: post.coverImage || "",
                      author: post.author || "Unknown",
                      category: post.category.name,
                      categorySlug: post.category.slug,
                      featured: post.featured,
                      likes: post.likes,
                      createdAt: post.createdAt,
                      slug: post.slug,
                    }}
                    featured
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Posts Section */}
        {trendingPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border">
            <div className="space-y-12">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Trending Now
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-balance">
                  Latest from Our Creators
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.excerpt,
                      coverImage: post.coverImage || "",
                      author: post.author || "Unknown",
                      category: post.category.name,
                      categorySlug: post.category.slug,
                      featured: post.featured,
                      likes: post.likes,
                      createdAt: post.createdAt,
                      slug: post.slug,
                    }}
                  />
                ))}
              </div>

              <div className="text-center pt-8">
                <Link href="/blog">
                  <Button variant="outline" size="lg">
                    View All Articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <div id="newsletter">
          <NewsletterSection />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <AdSlot position="FOOTER" />
        </div>
      </main>
      <Footer />
    </>
  );
}

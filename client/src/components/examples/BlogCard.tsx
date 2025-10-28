import BlogCard from '../BlogCard'

export default function BlogCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <BlogCard
        id="1"
        title="Real Estate Investment Trends in Nigeria 2024"
        excerpt="Discover the latest trends shaping the Nigerian real estate market and investment opportunities."
        category="Market Insights"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
        author="David Johnson"
        publishedAt="Oct 25, 2024"
      />
    </div>
  )
}

import Link from "next/link";

const categories = [
  {
    title: "Daily essentials",
    description: "Easy layers built for all-day comfort.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Outerwear",
    description: "Lightweight layers with a polished finish.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Accessories",
    description: "Small details that complete every look.",
    image:
      "https://images.unsplash.com/photo-1521369909026-2afc1c0d4f2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Footwear",
    description: "A grounded feel, elevated by movement.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
];

const highlights = [
  {
    title: "Designed for comfort",
    text: "Soft-touch fabrics that move with your routine.",
  },
  {
    title: "Premium everyday",
    text: "Simple silhouettes that still feel elevated.",
  },
  {
    title: "Fast dispatch",
    text: "Orders leave our studio in under 48 hours.",
  },
];

export default function HomePage() {
  return (
    <div className="pageShell">
      <div className="container">
        <section className="heroSection">
          <div className="heroContent">
            <span className="eyebrow">Fresh daily edits</span>
            <h1>Made for every day, for everyone.</h1>
            <p>
              Thoughtful essentials for movement, comfort, and everyday
              confidence — from city mornings to slow weekends.
            </p>
            <div className="heroButtons">
              <Link href="/shop" className="pillButton primary">
                Shop now
              </Link>
              <Link href="/about" className="pillButton secondary">
                Learn more
              </Link>
            </div>
          </div>

          <div className="heroVisual">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
              alt="Broadr lifestyle fashion"
            />
            <div className="floatingTag">
              <span>New drop</span>
              <strong>Spring / Summer 2026</strong>
            </div>
          </div>
        </section>

        <section className="featureGrid">
          {highlights.map((item) => (
            <article key={item.title} className="featureCard">
              <span className="eyebrow">Better living</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="pageShell" style={{ paddingTop: 24 }}>
          <div className="introRow">
            <div>
              <span className="eyebrow">Browse categories</span>
              <h1>Everything you need, in one place.</h1>
            </div>
            <Link href="/shop" className="pillButton secondary">
              Shop all
            </Link>
          </div>

          <div className="categoryGrid">
            {categories.map((category) => (
              <article key={category.title} className="categoryCard">
                <img src={category.image} alt={category.title} />
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

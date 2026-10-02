import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pageShell">
      <div className="container sectionLayout">
        <div className="contentBlock">
          <span className="eyebrow">Our story</span>
          <h1>Thoughtful essentials for modern routines.</h1>
          <p>
            Broadr was built for the everyday rhythm of real life: quick
            mornings, long commutes, slow weekends, and everything in between.
            We design simple, elevated pieces that carry you gracefully from one
            moment to the next.
          </p>
          <p>
            Our collections focus on comfort, durability, and a clean look that
            feels easy to live in. Every product is selected to feel premium
            without being loud.
          </p>

          <div className="ctaRow">
            <Link href="/shop" className="pillButton primary">
              Shop the collection
            </Link>
            <Link href="/signin" className="pillButton secondary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="statsPanel">
          <div>
            <strong>12k+</strong>
            <span>happy customers</span>
          </div>
          <div>
            <strong>4.9/5</strong>
            <span>average rating</span>
          </div>
          <div>
            <strong>48h</strong>
            <span>dispatch window</span>
          </div>
        </div>
      </div>
    </div>
  );
}

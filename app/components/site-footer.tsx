import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="container footerGrid">
        <div>
          <div className="brandMarkWrap footerBrand">
            <div className="brandMark">B</div>
            <span>Broadr</span>
          </div>
        </div>

        <div>
          <h4>Shop</h4>
          <Link href="/shop">All products</Link>
          <Link href="/about">Our story</Link>
          <Link href="/orders">Orders</Link>
        </div>

        <div>
          <h4>Support</h4>
          <Link href="/signin">Sign in</Link>
          <Link href="/signup">Create account</Link>
          <Link href="/about">Help center</Link>
        </div>

        <div>
          <h4>Follow</h4>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer">
            Pinterest
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>

      <div className="container footerBottom">
        <span>© 2026 Broadr</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Shipping</span>
      </div>
    </footer>
  );
}

export default SiteFooter;

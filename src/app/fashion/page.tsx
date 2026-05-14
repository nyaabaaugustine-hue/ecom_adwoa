import { ShopPageLayout } from "../../components/ShopPageLayout";

export const metadata = { title: "Fashion — Ankara, Kente & African Wear" };

export default function FashionPage() {
  return (
    <ShopPageLayout
      category="Fashion"
      title="Fashion"
      description="Discover our curated collection of Ankara, Kente and authentic African fashion for the modern Ghanaian woman."
      heroBg="https://res.cloudinary.com/dwsl2ktt2/image/upload/d_default.jpg/v1/adaw_tld2fa"
    />
  );
}

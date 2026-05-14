import { ShopPageLayout } from "../../components/ShopPageLayout";

export const metadata = { title: "Shop All Products" };

export default function ShopAllPage() {
  return (
    <ShopPageLayout
      category="All"
      title="Shop All"
      description="Browse our full collection of authentic Ghanaian fashion, cosmetics, skincare and more."
      heroBg="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif"
    />
  );
}

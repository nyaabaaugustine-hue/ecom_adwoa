import { ShopPageLayout } from "../../components/ShopPageLayout";

export const metadata = { title: "Cosmetics — Makeup & Beauty Products" };

export default function CosmeticsPage() {
  return (
    <ShopPageLayout
      category="Cosmetics"
      title="Cosmetics"
      description="Premium makeup and beauty products crafted for every skin tone. Look and feel your best every day."
      heroBg="https://res.cloudinary.com/dwsl2ktt2/image/upload/d_default.jpg/v1/uyy_ixp2x1"
    />
  );
}

import { ShopPageLayout } from "../../components/ShopPageLayout";

export const metadata = { title: "Skincare — Natural & Organic Care" };

export default function SkincarePage() {
  return (
    <ShopPageLayout
      category="Skincare"
      title="Skincare"
      description="Natural and organic skincare powered by shea butter, black soap, and Ghana's finest botanical ingredients."
      heroBg="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif"
    />
  );
}

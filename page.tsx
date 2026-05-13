import { SafeImage } from "../../components/SafeImage";

export default function TestImagesPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Fallback Demo</h1>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
        {/* Valid Image Case */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">Valid Public ID</h2>
          <p className="text-sm text-gray-500">Loads "adaw_tld2fa" successfully.</p>
          <SafeImage 
            src="adaw_tld2fa" 
            alt="Valid image" 
            width={500} 
            height={500} 
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Invalid Image Case */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Broken/Missing Public ID</h2>
          <p className="text-sm text-gray-500">ID "non_existent_id" triggers automatic Cloudinary d_default.jpg.</p>
          <SafeImage 
            src="non_existent_id" 
            alt="Invalid image" 
            width={500} 
            height={500} 
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>

      <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
        <p className="text-sm font-mono">Structure: https://res.cloudinary.com/[cloud]/image/upload/d_default.jpg/v1/[id]</p>
      </div>
    </div>
  );
}
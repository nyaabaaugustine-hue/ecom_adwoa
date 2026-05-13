import { Star, Quote } from "lucide-react";
import { SafeImage } from "./SafeImage";

const testimonials = [
  {
    id: 1,
    name: "Akua Mensah",
    location: "Accra",
    rating: 5,
    text: "I absolutely love shopping at Adwoa's! The quality of their Ankara dresses is unmatched, and the customer service is exceptional. My orders always arrive on time.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Efua Asante",
    location: "Kumasi",
    rating: 5,
    text: "The shea butter products are authentic and pure. I've been using them for months now and my skin has never looked better. Highly recommend!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Ama Darko",
    location: "Takoradi",
    rating: 5,
    text: "Beautiful jewelry pieces! I bought the gold beaded necklace set for my wedding and received so many compliments. The craftsmanship is outstanding.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-pink-500 text-sm font-medium tracking-widest uppercase mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-800">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote size={24} className="text-pink-200 mb-4" />
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < testimonial.rating
                        ? "text-pink-400 fill-pink-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <SafeImage
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
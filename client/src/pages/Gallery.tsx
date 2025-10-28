import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import proHome from "@assets/Pro home 1_1761621717728.jpg";
import plazaImage from "@assets/LARGEST PLAZA RESIZED_1761621717726.jpg";
import cropHeader from "@assets/crop for header_1761621717723.jpg";
import customerCare from "@assets/Customer Care_1761621717724.jpg";
import sealedDeal from "@assets/Sealed Deal_1761621717728.jpg";
import welcome from "@assets/welcome_1761621717729.jpg";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // TODO: Remove mock data
  const galleryItems = [
    { id: 1, image: proHome, category: "properties", title: "Luxury Interior" },
    { id: 2, image: plazaImage, category: "properties", title: "Commercial Plaza" },
    { id: 3, image: cropHeader, category: "properties", title: "Property Consultant" },
    { id: 4, image: customerCare, category: "office", title: "Customer Service" },
    { id: 5, image: sealedDeal, category: "events", title: "Deal Closing" },
    { id: 6, image: welcome, category: "office", title: "Financial Consultation" },
    { id: 7, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", category: "properties", title: "Modern Duplex" },
    { id: 8, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", category: "properties", title: "Luxury Apartment" },
    { id: 9, image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800", category: "properties", title: "City Development" },
  ];

  const categories = [
    { value: "all", label: "All" },
    { value: "properties", label: "Properties" },
    { value: "office", label: "Our Office" },
    { value: "events", label: "Events" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Gallery"
        subtitle="Explore our portfolio of stunning properties and success stories"
        image={proHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              data-testid={`button-category-${category.value}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg hover-elevate transition-all duration-300"
              data-testid={`gallery-item-${item.id}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

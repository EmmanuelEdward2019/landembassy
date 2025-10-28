import PropertyCard from '../PropertyCard'

export default function PropertyCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <PropertyCard
        id="1"
        title="Modern 4 Bedroom Duplex"
        price="45,000,000"
        location="Lekki Phase 1, Lagos"
        bedrooms={4}
        bathrooms={5}
        area={350}
        image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
        type="Residential"
      />
    </div>
  )
}

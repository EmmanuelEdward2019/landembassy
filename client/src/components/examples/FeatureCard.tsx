import FeatureCard from '../FeatureCard'
import { ShieldCheck } from 'lucide-react'

export default function FeatureCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <FeatureCard
        icon={ShieldCheck}
        title="Verified Properties"
        description="All our properties are thoroughly verified and legally documented for your peace of mind."
      />
    </div>
  )
}

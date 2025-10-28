interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">{value}</h3>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

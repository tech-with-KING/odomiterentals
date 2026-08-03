import { ShieldCheck, Truck, Users, Wrench } from 'lucide-react';

const ITEMS = [
  { icon: Truck, label: 'Same-Day Delivery Available' },
  { icon: Wrench, label: 'Setup & Breakdown Included' },
  { icon: Users, label: '500+ Events Served' },
  { icon: ShieldCheck, label: 'Sanitized Between Rentals' },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why customers trust us"
      className="border-b border-[color:var(--hairline)] bg-[color:var(--background)]"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-5 px-6 py-6 md:flex md:items-center md:justify-between md:divide-x md:divide-[color:var(--hairline)] md:py-5">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 px-2 md:flex-1 md:justify-center md:px-6">
            <Icon size={18} className="shrink-0 text-[color:var(--brand-deep)]" aria-hidden="true" />
            <span className="text-[13px] font-medium text-[color:var(--ink)]">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;

import { COMPANY } from "@/data/company";

export default function TopBar() {
  return (
    <div className="bg-heading text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
        <span>{COMPANY.tagline}</span>
      </div>
    </div>
  );
}

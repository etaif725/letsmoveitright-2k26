import type { IconType } from "react-icons";

interface IconBoxProps {
  icon: IconType;
  title: string;
  text: string;
}

export default function IconBox({ icon: Icon, title, text }: IconBoxProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 rounded-full bg-primary/10 p-4">
        <Icon className="text-2xl text-primary" />
      </div>
      <div>
        <h4 className="font-heading text-base font-bold text-heading">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

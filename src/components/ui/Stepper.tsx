import type { StepNumber } from "@/types";

interface StepperProps {
  current: StepNumber;
}

const STEPS = ["Location", "Details", "Contact"] as const;

export function Stepper({ current }: StepperProps) {
  return (
    <div className="relative mb-7 flex items-center justify-center">
      {STEPS.map((label, i) => {
        const num = (i + 1) as StepNumber;
        const active = num <= current;
        const isCurrent = num === current;
        const completed = num < current;

        return (
          <div
            key={label}
            className="relative flex flex-1 flex-col items-center"
          >
            <div
              className={[
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-200",
                active
                  ? "bg-primary text-heading"
                  : "bg-gray-100 text-gray-400",
                isCurrent ? "scale-110 ring-4 ring-primary/20" : "",
              ].join(" ")}
            >
              {completed ? "✓" : num}
            </div>
            <span
              className={[
                "mt-1.5 text-[11px] uppercase tracking-wider transition-colors duration-200",
                active ? "text-heading" : "text-gray-400",
                isCurrent ? "font-semibold" : "",
              ].join(" ")}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "absolute top-[15px] left-[calc(50%+22px)] z-0 h-0.5 w-[calc(100%-44px)] rounded-full transition-colors duration-200",
                  completed ? "bg-primary" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

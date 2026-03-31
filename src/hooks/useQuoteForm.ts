import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitQuote } from "@/lib/api";

export const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  movingFrom: z.string().min(2, "Moving from address is required"),
  movingTo: z.string().min(2, "Moving to address is required"),
  moveSize: z.string().min(1, "Please select a move size"),
  moveDate: z.string().min(1, "Please select a move date"),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export function useQuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      movingFrom: "",
      movingTo: "",
      moveSize: "",
      moveDate: "",
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      setSubmitError(null);
      await submitQuote(data);
      setSubmitted(true);
      form.reset();
    } catch {
      setSubmitError("Something went wrong. Please try again or call us directly.");
    }
  };

  return {
    form,
    submitted,
    submitError,
    onSubmit,
    setSubmitted,
  };
}

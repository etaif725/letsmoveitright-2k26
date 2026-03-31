export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveSize: string;
  moveDate: string;
}

export async function submitQuote(data: QuoteFormData): Promise<{ message: string }> {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit quote. Please try again.");
  }

  return response.json();
}

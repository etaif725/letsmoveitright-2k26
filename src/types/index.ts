// ─── Form state ─────────────────────────────────────────────────

export interface FormState {
  pickupRaw: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  destRaw: string;
  destCity: string;
  destState: string;
  destZip: string;
  moveDate: string;
  moveSize: string;
  fullName: string;
  email: string;
  phone: string;
}

export type FormErrors = Partial<Record<keyof FormState, string>>;

export type StepNumber = 1 | 2 | 3;


// ─── Google Places ──────────────────────────────────────────────

export interface ParsedPlace {
  formatted: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}


// ─── Leads gateway ──────────────────────────────────────────────

export interface LeadPayload {
  servtypeid: number;
  firstname: string;
  lastname: string;
  ozip: string;
  ocity: string;
  ostate: string;
  dzip: string;
  dcity: string;
  dstate: string;
  movedte: string;
  movesize: string;
  email: string;
  phone1: string;
  consent: string;
  label: string;
}

export interface SubmitResult {
  ok: boolean;
  msg: string;
  leadId?: string;
  isDuplicate?: boolean;
}

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});

export const budgetRanges = [
  "Under ₦500,000",
  "₦500,000 – ₦1,500,000",
  "₦1,500,000 – ₦5,000,000",
  "₦5,000,000+",
  "Not sure yet",
] as const;

export const timelines = ["ASAP", "Within 1 month", "1–3 months", "3+ months", "Flexible"] as const;

export const quoteSchema = z.object({
  service: z.string().trim().min(2, "Choose a service").max(160),
  projectBrief: z.string().trim().min(20, "Please describe the project in a little more detail").max(2000),
  goals: z.string().trim().max(1000).optional(),
  timeline: z.string().trim().max(60).optional(),
  budgetRange: z.string().trim().min(2, "Choose a budget range").max(60),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
});

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
  preferredDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  preferredTime: z.string().trim().min(3, "Choose a time slot").max(40),
  needs: z.string().trim().min(10, "Tell us what you need help with").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;

export const portfolioCategories = [
  "Web Design",
  "AI Automation",
  "Branding",
  "Social Media Ads",
  "Copywriting",
  "Complete Digital Solutions",
] as const;

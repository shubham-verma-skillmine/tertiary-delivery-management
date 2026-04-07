import z from "zod";

export const InvoiceSchema = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.string(),
  itemCount: z.number(),
  paymentMode: z.string(),
  status: z.enum(["paid", "pending", "overdue"]),
  overdueDays: z.number().optional(),
  dueDate: z.string(),
  note: z.string().optional(),
  items: z.array(z.any()).default([]),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

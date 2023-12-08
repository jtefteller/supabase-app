import * as z from "zod";

export const checkoutFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  streetAddress: z.string(),
  country: z.string(),
  city: z.string(),
  region: z.string().min(2).max(2),
  postalCode: z.string().max(7),
  products: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one service.",
  }),
});

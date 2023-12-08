import { z } from "zod";

import { stripe } from "@/utils/stripe/stripe";
import { absoluteUrl } from "@/utils/utils";
import { checkoutFormSchema } from "@/utils/validators/checkoutForm";
const billingUrl = absoluteUrl("/thank-you");

async function getCheckoutSession(priceIDs: string[], customerEmail: string) {
  return await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "payment",
    billing_address_collection: "auto",
    customer_email: customerEmail,
    line_items: priceIDs.map((id) => ({ price: id, quantity: 1 })),
  });
}

export async function POST(
  req: Request,
  ctx: z.infer<typeof checkoutFormSchema>
) {
  try {
    const json = await req.json();
    const body = await checkoutFormSchema.parseAsync(json);
    const priceIds: string[] = [];
    for (let key of body.products) {
      const product = await stripe.products.retrieve(key);
      if (product && product.default_price) {
        priceIds.push(product.default_price as string);
      }
    }
    const stripeSession = await getCheckoutSession(priceIds, body.email);
    return new Response(JSON.stringify({ url: stripeSession.url }));
    // return new Response(JSON.stringify({ keys: productKeys }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

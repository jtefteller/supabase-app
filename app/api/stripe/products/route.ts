import { productJson } from "@/products";
import { stripe } from "@/utils/stripe/stripe";

export async function GET(req: Request) {
  try {
    const stripeProducts = [];
    for (let p of productJson.products) {
      const stripeProduct = await stripe.products.retrieve(p.id);
      stripeProducts.push(stripeProduct);
    }
    return new Response(JSON.stringify({ products: stripeProducts }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

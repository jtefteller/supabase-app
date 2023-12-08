"use client";
import Link from "next/link";
import Stripe from "stripe";
import Image from "next/image";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/utils";
import { buttonVariants } from "@/components/ui/button";
import { checkoutFormSchema } from "@/utils/validators/checkoutForm";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Loading from "./Loading";

export default function CheckoutForm() {
  const [next, setNext] = useState(false);
  const [productData, setProductData] = useState<Stripe.Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const resp = await fetch("/api/stripe/products");
      const { products } = await resp.json();
      setProductData(products);
    };
    fetchProducts();
  }, []);

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      products: [],
    },
  });

  const { errors } = form.formState;
  useEffect(() => {
    if (errors?.products && errors?.products?.message !== "") {
      setNext(false);
    }
  }, [errors?.products]);

  async function onSubmit(data: z.infer<typeof checkoutFormSchema>) {
    const resp = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp?.ok) {
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
        description: (
          <div>
            There was a problem with your request.
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          </div>
        ),
      });
    } else {
      const data = await resp.json();
      window.location.href = data.url;
    }
  }

  if (productData.length == 0) {
    return <Loading />;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            next ? "hidden" : "",
            "border-b border-gray-900/10 pb-12 mt-6"
          )}
        >
          <FormField
            control={form.control}
            name="products"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Select Services</FormLabel>
                  <FormDescription>
                    Must select at least one service.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 [&>*:nth-child(2n-1):nth-last-of-type(1)]:col-span-full">
                  {productData.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="products"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            // className="flex flex-row items-start space-x-3 space-y-0"
                            className=" rounded-lg border bg-card text-card-foreground shadow-sm"
                          >
                            <div className="flex flex-col space-y-1.5 p-6">
                              <div className="text-2xl font-semibold leading-none tracking-tight">
                                {item.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Service
                              </div>
                            </div>
                            <div className="p-6 pt-0 items-center">
                              <FormLabel className="text-lg mr-2">
                                Purchase
                              </FormLabel>
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                            </div>
                            <div className="flex flex-row items-center p-6 pt-0 gap-x-5 max-w-xl">
                              <Image
                                src={item.images[0]}
                                height={150}
                                width={150}
                                alt={item.name}
                              />
                              {item.description}
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn(
            next ? "" : "hidden",
            "border-b border-gray-900/10 pb-12 mt-6"
          )}
        >
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use the address where you want the service to to take place.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-5 shadow-sm bg-white rounded-lg">
            <FormField
              name="firstName"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="family-name"
                      // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="email"
                      id="email"
                      type="email"
                      autoComplete="email"
                      // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="country"
              render={({ field }) => (
                <FormItem className="sm:col-span-4">
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="united-states">
                        United States
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="streetAddress"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="streetAddress"
                      id="streetAddress"
                      type="text"
                      autoComplete="street-address"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="city"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="city"
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="region"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="region"
                      id="region"
                      type="text"
                      autoComplete="address-level1"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="postalCode"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>ZIP / Postal code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            href="https://aa-pest.com/"
            className="absolute right-5 lg:left-5 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>{" "}
            Cancel
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setNext(!next);
            }}
            className={cn(
              buttonVariants({ variant: next ? "secondary" : "default" })
            )}
          >
            {next ? "Back" : "Personal Info"}
          </button>
          {next ? (
            <button type="submit" className={cn(buttonVariants())}>
              Payment
            </button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

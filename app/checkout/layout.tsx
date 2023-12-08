interface CheckoutProps {
  children: React.ReactNode;
}
export default function CheckoutLayout({ children }: CheckoutProps) {
  return (
    <div className="min-h-screen min-w-full bg-slate-50">
      <section className="min-h-screen max-w-4xl m-auto pt-5">
        {children}
      </section>
    </div>
  );
}

interface ThankYouProps {
  children: React.ReactNode;
}
export default function CheckoutLayout({ children }: ThankYouProps) {
  return <section className="max-w-4xl p-5 m-auto">{children}</section>;
}

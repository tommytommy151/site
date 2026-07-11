import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PageTransition } from "@/components/motion/page-transition";
import { PushSubscribePrompt } from "@/components/push/push-subscribe-prompt";
import { CategorySidebar } from "@/components/layout/category-sidebar";
import { PageviewTracker } from "@/components/analytics/pageview-tracker";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PageviewTracker />
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1660px] gap-6">
          <div className="hidden py-8 pl-5 sm:pl-8 lg:block lg:pl-10">
            <CategorySidebar />
          </div>
          <div className="min-w-0 flex-1">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <PushSubscribePrompt />
    </div>
  );
}

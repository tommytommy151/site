import { Container } from "@/components/layout/container";
import { AccountGuard } from "@/components/account/account-guard";
import { AccountSidebar } from "@/components/account/account-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <AccountGuard>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
            <AccountSidebar />
            <div>{children}</div>
          </div>
        </AccountGuard>
      </Container>
    </div>
  );
}

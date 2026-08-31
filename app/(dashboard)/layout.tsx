import AuthGuard from "@/components/guards/AuthGuard";
import SubscriptionGuard from "@/components/guards/SubscriptionGuard";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

export default function DashboardRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SubscriptionGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </SubscriptionGuard>
    </AuthGuard>
  );
}

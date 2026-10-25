export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  // Dashboard pages manage their own layout via DashboardLayout component
  return <>{children}</>;
}

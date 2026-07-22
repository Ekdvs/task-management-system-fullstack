import AppShell from "@/src/components/AppShell";


export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

import AppBar from "./components/header";
import { Sidebar } from "./components/side-bar";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Ensure the AppBar is always at the top */}
      <AppBar />

      <div
        style={{
          flex: 1,
          display: "flex",
        }}
      >
        <Sidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}

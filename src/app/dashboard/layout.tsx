import Icon from "../assests/svg/log-ico.svg";
import AppBar from "./components/header";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dash-layout">
      <AppBar />
      {children}
    </div>
  );
}

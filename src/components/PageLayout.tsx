
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface PageLayoutProps {
  children: React.ReactNode;
  userType?: "admin" | "candidate";
  userName?: string;
}

export default function PageLayout({ 
  children, 
  userType = "admin",
  userName = "Admin User"
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userType={userType} userName={userName} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

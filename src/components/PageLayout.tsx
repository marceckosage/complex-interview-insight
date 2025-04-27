
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

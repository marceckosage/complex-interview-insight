
import { useIsMobile } from "@/hooks/use-mobile";

export default function Footer() {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gray-50 py-6 md:py-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ComplexAssess. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-1 md:mt-0 md:ml-4">
              V0.000.001
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <a href="#" className="text-sm text-gray-600 hover:text-brand-purple">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-brand-purple">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-brand-purple">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025. Built with</span>
            <Heart className="h-4 w-4 fill-vibrant-maroon text-vibrant-maroon animate-pulse" />
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium bg-gradient-to-r from-vibrant-gold to-vibrant-deep-amber bg-clip-text text-transparent underline-offset-4 hover:underline transition-all"
            >
              caffeine.ai
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Malik Savings Bank - Your trusted financial partner since 2018
          </p>
        </div>
      </div>
    </footer>
  );
}

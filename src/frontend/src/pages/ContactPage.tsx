import { Building2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useContactInfo } from "../hooks/useQueries";

export default function ContactPage() {
  const { data: contactInfo, isLoading } = useContactInfo();

  const contactItems = [
    {
      icon: MapPin,
      label: "Address",
      value: contactInfo?.address || "123 Main Street, Anytown, 12345",
      color: "text-chart-1",
      bgColor: "bg-chart-1/20",
    },
    {
      icon: Phone,
      label: "Phone",
      value: contactInfo?.phone || "+123 456 7890",
      color: "text-chart-2",
      bgColor: "bg-chart-2/20",
      href: `tel:${contactInfo?.phone || "+1234567890"}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: contactInfo?.email || "info@maliksavings.com",
      color: "text-chart-3",
      bgColor: "bg-chart-3/20",
      href: `mailto:${contactInfo?.email || "info@maliksavings.com"}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-secondary/50">
      {/* Hero Section */}
      <section className="border-b border-primary/20 bg-gradient-to-br from-secondary via-background to-secondary/80">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/20 p-3 mb-6 shadow-gold-glow">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              We're here to help. Reach out to us through any of the following
              channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold md:text-4xl leading-tight mb-3">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Contact Information
                </span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Feel free to contact us during business hours or send us a
                message anytime
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return item.href ? (
                  <a key={item.label} href={item.href}>
                    <div
                      className={`group rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-all ${
                        item.href
                          ? "cursor-pointer hover:shadow-gold-glow hover:border-primary/50 hover:scale-105"
                          : ""
                      }`}
                    >
                      <div
                        className={`inline-flex rounded-lg ${item.bgColor} p-3 mb-4 shadow-gold-glow`}
                      >
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <p
                        className={`text-base font-semibold text-card-foreground leading-relaxed mb-2 ${item.href ? "group-hover:text-primary transition-colors" : ""}`}
                      >
                        {item.value}
                      </p>
                      <h3 className="text-sm font-medium text-muted-foreground leading-tight">
                        {item.label}
                      </h3>
                    </div>
                  </a>
                ) : (
                  <div key={item.label}>
                    <div className="group rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-all">
                      <div
                        className={`inline-flex rounded-lg ${item.bgColor} p-3 mb-4 shadow-gold-glow`}
                      >
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <p className="text-base font-semibold text-card-foreground leading-relaxed mb-2">
                        {item.value}
                      </p>
                      <h3 className="text-sm font-medium text-muted-foreground leading-tight">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info Card */}
            <div className="mt-12 rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-gold-glow md:p-12 hover:shadow-gold-glow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Visit Us
                </span>
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Our team is available to assist you with all your banking needs.
                Whether you're looking to open a new account, discuss investment
                opportunities, or have questions about our services, we're here
                to help.
              </p>
              <div className="rounded-lg bg-secondary/30 p-6 border-2 border-primary/20">
                <h4 className="font-semibold text-card-foreground mb-3 text-base leading-tight">
                  Business Hours
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span className="leading-relaxed">Monday - Friday:</span>
                    <span className="font-medium text-primary leading-relaxed">
                      9:00 AM - 5:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="leading-relaxed">Saturday:</span>
                    <span className="font-medium text-primary leading-relaxed">
                      10:00 AM - 2:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="leading-relaxed">Sunday:</span>
                    <span className="font-medium text-card-foreground leading-relaxed">
                      Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import { Award, Calendar, Loader2, Shield, TrendingUp } from "lucide-react";
import { useAboutPageContent, useBankInfo } from "../hooks/useQueries";

export default function AboutPage() {
  const { data: bankInfo, isLoading: isLoadingBankInfo } = useBankInfo();
  const { data: aboutContent, isLoading: isLoadingAboutContent } =
    useAboutPageContent();

  const isLoading = isLoadingBankInfo || isLoadingAboutContent;

  const calculateYearsOfOperation = () => {
    if (!bankInfo) return 0;
    const foundingDate = new Date(Number(bankInfo.foundingDate) / 1_000_000);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - foundingDate.getFullYear();
    return years;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Banking",
      description:
        "Your assets are protected with industry-leading security measures and protocols.",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description:
        "Strategic investments designed to maximize returns while managing risk effectively.",
    },
    {
      icon: Award,
      title: "Trusted Partner",
      description:
        "Years of experience in providing reliable financial services to our valued clients.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-secondary/50">
      {/* Hero Section */}
      <section className="border-b border-primary/20 bg-gradient-to-br from-secondary via-background to-secondary/80">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                About {bankInfo?.name || "Malik Savings Bank"}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              A legacy of trust, excellence, and financial stability
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-12">
            {/* Bank Info Card */}
            <div className="rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-gold-glow md:p-12 hover:shadow-gold-glow-lg transition-shadow">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 shadow-gold-glow">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary leading-tight mb-2">
                      {bankInfo
                        ? formatDate(bankInfo.foundingDate)
                        : "20th February 2018"}
                    </p>
                    <h2 className="text-lg font-semibold text-card-foreground leading-tight">
                      Founded
                    </h2>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 shadow-gold-glow">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-accent leading-tight mb-2">
                      {calculateYearsOfOperation()} Years of Excellence
                    </p>
                    <h2 className="text-lg font-semibold text-card-foreground leading-tight">
                      Years of Operation
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse-glow" />
                    <img
                      src="/assets/generated/malik-bank-logo-transparent.dim_200x100.png"
                      alt="Malik Savings Bank Logo"
                      className="relative max-w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-lg md:p-12 hover:shadow-gold-glow transition-shadow">
              <h2 className="text-2xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Our Story
                </span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {aboutContent?.description || "Loading..."}
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-all hover:shadow-gold-glow hover:border-primary/50 hover:scale-105"
                  >
                    <div className="inline-flex rounded-lg bg-primary/20 p-3 mb-4 shadow-gold-glow">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

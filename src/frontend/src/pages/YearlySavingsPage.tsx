import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Coins, TrendingUp } from "lucide-react";
import { useYearlySavings } from "../hooks/useQueries";

export default function YearlySavingsPage() {
  const { data: yearlySavings, isLoading } = useYearlySavings();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(2)} g`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading yearly savings...</p>
        </div>
      </div>
    );
  }

  const sortedSavings = yearlySavings
    ? [...yearlySavings].sort((a, b) => Number(b.year) - Number(a.year))
    : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <section className="relative border-b border-primary/20 bg-gradient-to-r from-secondary via-secondary/50 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,oklch(var(--accent)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-6 shadow-gold-glow">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Yearly Savings
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Track our annual savings growth across cash, gold, and silver
              investments
            </p>
          </div>
        </div>
      </section>

      {/* Yearly Savings Cards */}
      <section className="container mx-auto px-4 py-12">
        {sortedSavings.length === 0 ? (
          <Card className="border-primary/20 shadow-gold-glow">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No yearly savings data available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSavings.map((saving) => (
              <Card
                key={Number(saving.year)}
                className="border-primary/20 shadow-gold-glow hover:shadow-[0_0_30px_oklch(var(--primary)/0.3)] transition-all duration-300 group"
              >
                <CardHeader className="border-b border-primary/10 bg-gradient-to-br from-primary/5 to-transparent pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                      {Number(saving.year)}
                    </CardTitle>
                    <Calendar className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Cash Savings */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border border-primary/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
                    </div>
                    <div className="flex-1 text-right">
                      <span className="text-sm font-bold text-foreground leading-tight block">
                        {formatCurrency(saving.cash)}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground leading-tight block mt-1">
                        Cash
                      </span>
                    </div>
                  </div>

                  {/* Gold Savings */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border border-primary/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {formatWeight(saving.gold)}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground leading-tight block mt-1">
                        Gold
                      </span>
                    </div>
                  </div>

                  {/* Silver Savings */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border border-primary/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-chart-4 animate-pulse" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {formatWeight(saving.silver)}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground leading-tight block mt-1">
                        Silver
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 mt-4 border-t border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight block">
                          {formatCurrency(saving.total)}
                        </span>
                        <span className="text-xs font-semibold text-primary leading-tight block mt-1">
                          Total Value
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { Loader2, PieChart, TrendingUp, Users } from "lucide-react";
import ShareValueTrendChart from "../components/ShareValueTrendChart";
import {
  useHomePageData,
  useShareValueHistory,
  useShareholders,
} from "../hooks/useQueries";

export default function ShareholdersPage() {
  const { data: shareholders, isLoading: shareholdersLoading } =
    useShareholders();
  const { data: homeData, isLoading: homeDataLoading } = useHomePageData();

  const isLoading = shareholdersLoading || homeDataLoading;
  const totalAssets = homeData?.totalAssets || 0;
  const { data: shareValueHistory = [] } = useShareValueHistory();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateShareValue = (ownershipPercentage: number) => {
    return (ownershipPercentage / 100) * totalAssets;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-secondary/50">
      {/* Hero Section */}
      <section className="border-b border-primary/20 bg-gradient-to-br from-secondary via-background to-secondary/80">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/20 p-3 mb-6 shadow-gold-glow">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Our Shareholders
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              Meet the valued partners who support our mission and growth
            </p>
          </div>
        </div>
      </section>

      {/* 1% Share Value Live Tile */}
      <section className="container mx-auto px-4 pt-8 pb-0 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <div className="w-full">
            <div className="relative rounded-xl border border-primary/40 bg-secondary/80 px-5 py-4 shadow-gold-glow overflow-hidden w-full">
              {/* Subtle glow backdrop */}
              <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 40%, oklch(0.75 0.18 85 / 0.10) 0%, transparent 70%)",
                }}
              />
              {/* Header row */}
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest leading-none">
                  1% Share Value
                </span>
                {/* Pulsing LIVE dot */}
                <span className="flex items-center gap-1 ml-auto">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[9px] font-bold text-primary/80 uppercase tracking-widest leading-none">
                    Live
                  </span>
                </span>
              </div>
              {/* Value */}
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary my-1" />
              ) : (
                <p className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
                  {formatCurrency(totalAssets / 100)}
                </p>
              )}
              {/* Subtitle */}
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                = 1% of Total Assets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Share Value Trend Chart */}
      <ShareValueTrendChart
        shareValueHistory={shareValueHistory}
        shareholders={shareholders ?? []}
      />

      {/* Shareholders Table Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border-2 border-primary/20 bg-card shadow-gold-glow overflow-hidden hover:shadow-gold-glow-lg transition-shadow">
            <div className="border-b border-primary/20 bg-secondary/30 px-4 py-5 md:px-8 md:py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 shadow-gold-glow">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground md:text-2xl leading-tight">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Ownership Structure
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Distribution of ownership among shareholders
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20 bg-secondary/20">
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-card-foreground leading-tight">
                        Shareholder Name
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-right text-xs md:text-sm font-semibold text-card-foreground leading-tight whitespace-nowrap">
                        Share %
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-right text-xs md:text-sm font-semibold text-card-foreground leading-tight whitespace-nowrap">
                        Share Value (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {shareholders && shareholders.length > 0 ? (
                      shareholders.map((shareholder) => {
                        const shareValue = calculateShareValue(
                          shareholder.ownershipPercentage,
                        );
                        return (
                          <tr
                            key={shareholder.name}
                            className="transition-colors hover:bg-primary/5"
                          >
                            <td className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-medium text-card-foreground leading-relaxed">
                              {shareholder.name}
                            </td>
                            <td className="px-4 py-3 md:px-6 md:py-4 text-right text-xs md:text-sm font-bold text-primary whitespace-nowrap">
                              {shareholder.ownershipPercentage.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 md:px-6 md:py-4 text-right text-xs md:text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                              {formatCurrency(shareValue)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 md:px-6 text-center text-muted-foreground text-sm"
                        >
                          No shareholder data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Card */}
          {shareholders && shareholders.length > 0 && (
            <div className="mt-6 rounded-xl border-2 border-primary/20 bg-card p-4 md:p-6 shadow-sm hover:shadow-gold-glow transition-shadow">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-card-foreground leading-tight mb-1">
                    {shareholders.length}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                    Total Shareholders
                  </p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-primary leading-tight mb-1">
                    {shareholders
                      .reduce((sum, sh) => sum + sh.ownershipPercentage, 0)
                      .toFixed(2)}
                    %
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                    Total Ownership
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-1">
                    {formatCurrency(totalAssets)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                    Total Assets
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

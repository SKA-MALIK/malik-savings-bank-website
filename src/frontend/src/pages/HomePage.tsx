import {
  Building,
  Coins,
  Gem,
  Loader2,
  Radio,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  useAssetCategoryBreakdown,
  useHomePageData,
} from "../hooks/useQueries";

export default function HomePage() {
  const { data: homeData, isLoading: isLoadingHome } = useHomePageData();
  const { data: categoryBreakdown, isLoading: isLoadingBreakdown } =
    useAssetCategoryBreakdown();

  const isLoading = isLoadingHome || isLoadingBreakdown;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatWeight = (grams: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(grams);
  };

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(rate);
  };

  const assetCategories = [
    {
      name: "Cash Holdings",
      key: "cash",
      icon: Wallet,
      gradient: "from-vibrant-gold to-vibrant-deep-amber",
      bgGradient: "from-vibrant-gold/10 to-vibrant-deep-amber/10",
      showWeight: false,
    },
    {
      name: "Bank Deposits",
      key: "bank",
      icon: Building,
      gradient: "from-vibrant-deep-amber to-vibrant-maroon",
      bgGradient: "from-vibrant-deep-amber/10 to-vibrant-maroon/10",
      showWeight: false,
    },
    {
      name: "Gold Investments",
      key: "gold",
      icon: Coins,
      gradient: "from-vibrant-maroon to-vibrant-royal-blue",
      bgGradient: "from-vibrant-maroon/10 to-vibrant-royal-blue/10",
      showWeight: true,
    },
    {
      name: "Silver Investments",
      key: "silver",
      icon: Gem,
      gradient: "from-vibrant-royal-blue to-vibrant-gold",
      bgGradient: "from-vibrant-royal-blue/10 to-vibrant-gold/10",
      showWeight: true,
    },
  ];

  const getPercentage = (key: string) => {
    if (!categoryBreakdown) return 0;
    const item = categoryBreakdown.find(([name]) => name === key);
    return item ? item[1] : 0;
  };

  const getAssetValue = (key: string) => {
    if (!homeData?.assetBreakdown) return 0;
    const asset =
      homeData.assetBreakdown[key as keyof typeof homeData.assetBreakdown];
    if (typeof asset === "number") {
      return asset;
    }
    if (
      asset &&
      typeof asset === "object" &&
      "weightGrams" in asset &&
      "ratePerGram" in asset
    ) {
      return asset.weightGrams * asset.ratePerGram;
    }
    return 0;
  };

  const getAssetWeight = (key: string) => {
    if (!homeData?.assetBreakdown) return null;
    const asset =
      homeData.assetBreakdown[key as keyof typeof homeData.assetBreakdown];
    if (asset && typeof asset === "object" && "weightGrams" in asset) {
      return asset.weightGrams;
    }
    return null;
  };

  const getAssetRate = (key: string) => {
    if (!homeData?.assetBreakdown) return null;
    const asset =
      homeData.assetBreakdown[key as keyof typeof homeData.assetBreakdown];
    if (asset && typeof asset === "object" && "ratePerGram" in asset) {
      return asset.ratePerGram;
    }
    return null;
  };

  return (
    <>
      {/* Video Hero Section */}
      <section className="relative w-full h-screen overflow-hidden border-b border-primary/20 bg-black">
        {/* Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/assets/1000075984-removebg-preview-1.png"
            alt="Malik Savings Bank Background"
            className="w-1/2 md:w-1/3 lg:w-1/4 opacity-10 blur-sm"
          />
        </div>

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <source
            src="/assets/Screenrecording_20250111_153901(1) (online-video-cutter.com).mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Vibrant gradient accent overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(var(--vibrant-gold)/0.15),oklch(var(--vibrant-maroon)/0.08),transparent_70%)]" />

        {/* Content overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="space-y-6 max-w-4xl">
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon opacity-40 rounded-full animate-pulse-glow" />
              <img
                src="/assets/1000075984-removebg-preview-1.png"
                alt="Malik Savings Bank"
                className="relative h-28 md:h-40 w-auto drop-shadow-2xl"
              />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-2xl leading-tight">
              <span className="bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift">
                Malik Savings Bank
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg leading-relaxed">
              Your trusted financial partner since 2018
            </p>
          </div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary to-transparent" />
      </section>

      {/* Live Total Assets Ticker */}
      <section className="border-b border-primary/20 bg-gradient-to-r from-secondary via-background to-secondary">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <div
              className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-br from-secondary/80 via-card to-secondary/80 p-8 md:p-12 shadow-vibrant-glow-lg"
              style={{
                borderImage:
                  "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--vibrant-maroon)), oklch(var(--vibrant-royal-blue))) 1",
              }}
            >
              {/* Animated shimmer overlay with vibrant colors */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 animate-shimmer"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, oklch(var(--vibrant-gold) / 0.2) 25%, oklch(var(--vibrant-maroon) / 0.2) 50%, oklch(var(--vibrant-royal-blue) / 0.2) 75%, transparent 100%)",
                    backgroundSize: "1000px 100%",
                  }}
                />
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon opacity-40 rounded-full blur-xl animate-pulse-glow" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon shadow-vibrant-glow">
                      <TrendingUp className="h-7 w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-vibrant-gold/20 to-vibrant-maroon/20 border border-vibrant-gold/40 animate-pulse-glow">
                        <Radio className="h-3 w-3 text-vibrant-gold animate-pulse" />
                        <span className="text-xs font-semibold bg-gradient-to-r from-vibrant-gold to-vibrant-deep-amber bg-clip-text text-transparent uppercase tracking-wide">
                          Live
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                      Live Total Assets
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                      Real-time asset valuation
                    </p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-vibrant-gold" />
                      <span className="text-2xl font-bold text-muted-foreground">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift leading-tight">
                        {homeData
                          ? formatCurrency(homeData.totalAssets)
                          : "₹0.00"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-end gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-vibrant-gold animate-pulse" />
                        Updated in real-time
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative corner accents with vibrant gradients */}
              <div
                className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-2xl"
                style={{
                  borderImage:
                    "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--vibrant-royal-blue))) 1",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-2xl"
                style={{
                  borderImage:
                    "linear-gradient(135deg, oklch(var(--vibrant-maroon)), oklch(var(--vibrant-deep-amber))) 1",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Asset Breakdown Section */}
      <section className="bg-gradient-to-b from-secondary via-background to-secondary/50 container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl leading-tight mb-3">
            <span className="bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift">
              Asset Breakdown
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Diversified portfolio across multiple asset categories
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-vibrant-gold" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {assetCategories.map((category) => {
              const Icon = category.icon;
              const amount = getAssetValue(category.key);
              const weight = getAssetWeight(category.key);
              const rate = getAssetRate(category.key);
              const percentage = getPercentage(category.key);

              return (
                <div
                  key={category.key}
                  className="group rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-all hover:shadow-vibrant-glow hover:border-transparent hover:scale-105 relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`inline-flex rounded-lg bg-gradient-to-br ${category.gradient} p-3 mb-4 shadow-sm group-hover:shadow-vibrant-glow transition-shadow`}
                    >
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-card-foreground mb-2 leading-tight">
                      {formatCurrency(amount)}
                    </p>
                    {category.showWeight &&
                      weight !== null &&
                      rate !== null && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 leading-relaxed">
                          <span className="font-semibold">
                            {formatWeight(weight)} g
                          </span>
                          <span className="font-semibold">
                            {formatRate(rate)} / g
                          </span>
                        </div>
                      )}
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 leading-tight">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-500 animate-gradient-shift`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p
                        className={`text-sm font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
                      >
                        {percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Financial Growth Image Section */}
      <section className="bg-gradient-to-b from-secondary/50 via-background to-secondary container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-2xl border-2 border-transparent bg-card p-6 shadow-lg md:p-8 hover:shadow-vibrant-glow transition-all relative overflow-hidden"
            style={{
              borderImage:
                "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--vibrant-maroon))) 1",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-vibrant-gold/5 via-transparent to-vibrant-maroon/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <img
                src="/assets/generated/financial-growth.dim_600x300.jpg"
                alt="Financial Growth"
                className="w-full rounded-lg"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-card-foreground md:text-2xl leading-tight mb-2">
                  <span className="bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift">
                    Growing Together
                  </span>
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Building a stronger financial future through strategic
                  investments and prudent management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

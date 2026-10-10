import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart2,
  DollarSign,
  Edit,
  FileText,
  LineChart,
  Lock,
  LogOut,
  Phone,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  AssetCategory,
  AssetMetricEntry,
  ShareValueEntry,
  YearlySaving,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import {
  useAboutPageContent,
  useAddAssetMetric,
  useAddShareValueEntry,
  useAddYearlySaving,
  useAssetMetrics,
  useContactInfo,
  useDeleteAssetMetric,
  useDeleteShareValueEntry,
  useDeleteYearlySaving,
  useHomePageData,
  useShareValueHistory,
  useShareholders,
  useUpdateAboutPageContent,
  useUpdateAssetMetric,
  useUpdateAssets,
  useUpdateContactInfo,
  useUpdateShareValueEntry,
  useUpdateShareholders,
  useUpdateYearlySaving,
  useYearlySavings,
} from "../hooks/useQueries";

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300));

    const success = login(username, password);

    if (success) {
      toast.success("Login successful - Welcome Administrator");
      // Clear any cached data to ensure fresh fetch
      queryClient.invalidateQueries();
    } else {
      setLoginError("Invalid username or password. Please try again.");
      toast.error("Login failed");
    }

    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    setUsername("");
    setPassword("");
    setLoginError("");
    toast.success("Logged out successfully");
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
        <Card
          className="w-full max-w-md border-transparent shadow-vibrant-glow"
          style={{
            borderImage:
              "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--vibrant-maroon))) 1",
          }}
        >
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-gold mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
        <Card
          className="w-full max-w-md border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
          style={{
            borderImage:
              "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--vibrant-maroon))) 1",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-vibrant-gold/5 via-transparent to-vibrant-maroon/5 pointer-events-none" />
          <CardHeader className="space-y-3 text-center pb-6 relative z-10">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-vibrant-gold/20 to-vibrant-maroon/20 border border-vibrant-gold/30 shadow-vibrant-glow">
              <Lock className="h-8 w-8 text-vibrant-gold" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 relative z-10">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  required
                />
              </div>
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 text-base font-medium transition-all"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin dashboard
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-base">
              Manage bank data and information
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-vibrant-gold/30 hover:bg-gradient-to-r hover:from-vibrant-gold/10 hover:to-vibrant-maroon/10 hover:text-vibrant-gold h-10 px-6 transition-all"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 bg-secondary/50 border border-primary/20 h-auto p-1">
            <TabsTrigger
              value="assets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-gold/20 data-[state=active]:to-vibrant-deep-amber/20 data-[state=active]:text-vibrant-gold data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Assets</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-deep-amber/20 data-[state=active]:to-vibrant-maroon/20 data-[state=active]:text-vibrant-deep-amber data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger
              value="shareholders"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-maroon/20 data-[state=active]:to-vibrant-royal-blue/20 data-[state=active]:text-vibrant-maroon data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Shareholders</span>
            </TabsTrigger>
            <TabsTrigger
              value="yearly-savings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-royal-blue/20 data-[state=active]:to-vibrant-gold/20 data-[state=active]:text-vibrant-royal-blue data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Yearly Savings</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-gold/20 data-[state=active]:to-primary/20 data-[state=active]:text-vibrant-gold data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger
              value="asset-metrics"
              data-ocid="admin.asset_metrics.tab"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-deep-amber/20 data-[state=active]:to-vibrant-gold/20 data-[state=active]:text-vibrant-gold data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Asset Metrics</span>
            </TabsTrigger>
            <TabsTrigger
              value="share-trend"
              data-ocid="admin.share_trend.tab"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vibrant-maroon/20 data-[state=active]:to-vibrant-gold/20 data-[state=active]:text-vibrant-maroon data-[state=active]:shadow-vibrant-glow py-3 text-sm transition-all"
            >
              <LineChart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Share Trend</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <AssetsManagement />
          </TabsContent>

          <TabsContent value="about">
            <AboutContentManagement />
          </TabsContent>

          <TabsContent value="shareholders">
            <ShareholdersManagement />
          </TabsContent>

          <TabsContent value="yearly-savings">
            <YearlySavingsManagement />
          </TabsContent>

          <TabsContent value="contact">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="asset-metrics">
            <AssetMetricsManagement />
          </TabsContent>

          <TabsContent value="share-trend">
            <ShareValueHistoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ShareValueHistoryManagement() {
  const { data: history, isLoading } = useShareValueHistory();
  const { data: shareholders } = useShareholders();
  const addEntry = useAddShareValueEntry();
  const updateEntry = useUpdateShareValueEntry();
  const deleteEntry = useDeleteShareValueEntry();

  const [addDate, setAddDate] = useState("");
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({});

  // Edit state: key is `${date}|${shareholderName}`
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const shareholderNames = shareholders?.map((s) => s.name) ?? [];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDateDisplay = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addDate) {
      toast.error("Please select a date.");
      return;
    }
    const entries: ShareValueEntry[] = [];
    for (const name of shareholderNames) {
      const val = addAmounts[name]?.trim();
      if (val) {
        const amount = Number.parseFloat(val);
        if (!Number.isNaN(amount) && amount >= 0) {
          entries.push({
            date: addDate,
            shareholderName: name,
            shareAmount: amount,
          });
        }
      }
    }
    if (entries.length === 0) {
      toast.error("Please enter at least one share amount.");
      return;
    }
    for (const entry of entries) {
      await addEntry.mutateAsync(entry);
    }
    setAddDate("");
    setAddAmounts({});
  };

  const startEdit = (entry: ShareValueEntry) => {
    setEditKey(`${entry.date}|${entry.shareholderName}`);
    setEditAmount(String(entry.shareAmount));
  };

  const cancelEdit = () => {
    setEditKey(null);
    setEditAmount("");
  };

  const saveEdit = async (entry: ShareValueEntry) => {
    const amount = Number.parseFloat(editAmount);
    if (Number.isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    await updateEntry.mutateAsync({
      date: entry.date,
      shareholderName: entry.shareholderName,
      newAmount: amount,
    });
    cancelEdit();
  };

  const handleDelete = async (entry: ShareValueEntry) => {
    if (
      window.confirm(
        `Delete share value entry for ${entry.shareholderName} on ${formatDateDisplay(entry.date)}?`,
      )
    ) {
      await deleteEntry.mutateAsync({
        date: entry.date,
        shareholderName: entry.shareholderName,
      });
    }
  };

  // Sort display: latest date first, then by shareholder name
  const displayRows = history
    ? [...history].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        return dateCompare !== 0
          ? dateCompare
          : a.shareholderName.localeCompare(b.shareholderName);
      })
    : [];

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading share trend data...
      </div>
    );
  }

  return (
    <>
      <Card
        className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
        style={{
          borderImage:
            "linear-gradient(135deg, oklch(var(--vibrant-maroon)), oklch(var(--vibrant-gold))) 1",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-vibrant-maroon/5 via-transparent to-vibrant-gold/5 pointer-events-none" />
        <CardHeader className="pb-6 relative z-10">
          <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-maroon to-vibrant-gold bg-clip-text text-transparent flex items-center gap-2">
            <LineChart className="h-6 w-6 text-vibrant-gold" />
            Share Trend Manager
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Add daily share value entries per shareholder. These entries power
            the Daily Share Value Trend chart on the Shareholders page.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 relative z-10 space-y-8">
          {/* ── Add Entry Form ── */}
          <form onSubmit={handleAdd} className="space-y-5">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-vibrant-maroon to-vibrant-gold bg-clip-text text-transparent">
              Add Daily Entry
            </h3>
            <div className="space-y-2">
              <Label htmlFor="st-add-date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="st-add-date"
                type="date"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11 max-w-xs"
                data-ocid="admin.share_trend.add_date.input"
                required
              />
            </div>
            {shareholderNames.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No shareholders found. Please add shareholders first.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shareholderNames.map((name) => (
                  <div key={name} className="space-y-2">
                    <Label className="text-sm font-medium">{name}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={addAmounts[name] ?? ""}
                      onChange={(e) =>
                        setAddAmounts((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                      placeholder="Share Amount (₹)"
                      className="border-primary/20 focus:border-vibrant-gold h-11"
                      data-ocid="admin.share_trend.add_amount.input"
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="submit"
              disabled={addEntry.isPending || shareholderNames.length === 0}
              className="bg-gradient-to-r from-vibrant-maroon to-vibrant-gold hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-8 transition-all"
              data-ocid="admin.share_trend.add_button"
            >
              <Plus className="mr-2 h-4 w-4" />
              {addEntry.isPending ? "Adding..." : "Add Entry"}
            </Button>
          </form>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-gold/30 to-transparent" />

          {/* ── Data Table ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-vibrant-maroon to-vibrant-gold bg-clip-text text-transparent">
              Share Value History
              {displayRows.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({displayRows.length}{" "}
                  {displayRows.length === 1 ? "entry" : "entries"})
                </span>
              )}
            </h3>
            {displayRows.length === 0 ? (
              <div
                className="text-center py-10 text-muted-foreground rounded-lg border border-vibrant-gold/20 bg-gradient-to-r from-vibrant-maroon/5 to-vibrant-gold/5"
                data-ocid="admin.share_trend.empty_state"
              >
                No share value data yet. Add entries above.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-vibrant-gold/20">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-vibrant-maroon/20 to-vibrant-gold/20 border-b border-vibrant-gold/20">
                      <th className="text-left px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Date
                      </th>
                      <th className="text-left px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Shareholder
                      </th>
                      <th className="text-right px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Amount (₹)
                      </th>
                      <th className="text-right px-4 py-3 text-vibrant-gold font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map((entry, idx) => {
                      const rowKey = `${entry.date}|${entry.shareholderName}`;
                      const isEditing = editKey === rowKey;
                      return (
                        <tr
                          key={rowKey}
                          className="border-b border-vibrant-gold/10 hover:bg-vibrant-gold/5 transition-colors"
                          data-ocid={`admin.share_trend.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 font-medium whitespace-nowrap">
                            {formatDateDisplay(entry.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {entry.shareholderName}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                            {isEditing ? (
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="border-primary/20 focus:border-vibrant-gold h-9 text-right w-32 inline-block"
                                data-ocid="admin.share_trend.edit_amount.input"
                                autoFocus
                              />
                            ) : (
                              <span className="bg-gradient-to-r from-vibrant-maroon to-vibrant-gold bg-clip-text text-transparent">
                                {formatCurrency(entry.shareAmount)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              {isEditing ? (
                                <>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => saveEdit(entry)}
                                    disabled={updateEntry.isPending}
                                    className="bg-gradient-to-r from-vibrant-maroon to-vibrant-gold hover:opacity-90 text-primary-foreground h-8 px-3 text-xs"
                                    data-ocid={`admin.share_trend.save_button.${idx + 1}`}
                                  >
                                    {updateEntry.isPending
                                      ? "Saving..."
                                      : "Save"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelEdit}
                                    className="border-primary/20 h-8 px-3 text-xs"
                                    data-ocid={`admin.share_trend.cancel_button.${idx + 1}`}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => startEdit(entry)}
                                    className="border-vibrant-gold/30 hover:bg-vibrant-gold/10 hover:text-vibrant-gold h-9 w-9 transition-all"
                                    data-ocid={`admin.share_trend.edit_button.${idx + 1}`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(entry)}
                                    className="border-destructive/30 text-destructive hover:bg-destructive/10 h-9 w-9"
                                    data-ocid={`admin.share_trend.delete_button.${idx + 1}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AssetMetricsManagement() {
  const { data: metrics, isLoading } = useAssetMetrics();
  const addAssetMetric = useAddAssetMetric();
  const updateAssetMetric = useUpdateAssetMetric();
  const deleteAssetMetric = useDeleteAssetMetric();

  // Add form state
  const [addDate, setAddDate] = useState("");
  const [addTime, setAddTime] = useState("09:00");
  const [addValue, setAddValue] = useState("");

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editOriginalKey, setEditOriginalKey] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editValue, setEditValue] = useState("");

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState("");

  // Parse a stored ISO key into { date, time }
  const parseKey = (key: string) => {
    if (key.includes("T")) {
      const [d, t] = key.split("T");
      return { date: d, time: t.slice(0, 5) };
    }
    return { date: key, time: "00:00" };
  };

  // Build ISO key from date + time
  const buildKey = (date: string, time: string) => `${date}T${time}`;

  // Format date in IST for display
  const formatIST = (key: string) => {
    const { date, time } = parseKey(key);
    try {
      const [y, m, d] = date.split("-").map(Number);
      const [h, min] = time.split(":").map(Number);
      // Store IST directly as entered by admin — display as-is
      const dateObj = new Date(y, m - 1, d, h, min);
      return {
        date: dateObj.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch {
      return { date: key, time: "" };
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  // Sort entries ascending by ISO key for return calculation
  const sortedAsc: AssetMetricEntry[] = metrics
    ? [...metrics].sort((a, b) => a.date.localeCompare(b.date))
    : [];

  // Calculate return stats for each entry
  const withReturns = sortedAsc.map((entry, idx) => {
    if (idx === 0) return { ...entry, returnPct: 0, returnAmount: 0 };
    const prev = sortedAsc[idx - 1];
    const returnAmount = entry.value - prev.value;
    const returnPct = prev.value !== 0 ? (returnAmount / prev.value) * 100 : 0;
    return { ...entry, returnPct, returnAmount };
  });

  // Display descending (latest first)
  const displayRows = [...withReturns].reverse();

  // Calculate preview return for add form
  const addPreview = (() => {
    const val = Number.parseFloat(addValue);
    if (!val || !addDate) return null;
    // Find the latest entry before the entered datetime
    const newKey = buildKey(addDate, addTime || "00:00");
    const prevEntry = sortedAsc.filter((e) => e.date < newKey).pop();
    if (!prevEntry) return { returnPct: 0, returnAmount: 0 };
    const returnAmount = val - prevEntry.value;
    const returnPct =
      prevEntry.value !== 0 ? (returnAmount / prevEntry.value) * 100 : 0;
    return { returnPct, returnAmount };
  })();

  // Add form
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addDate) {
      toast.error("Please select a date.");
      return;
    }
    const val = Number.parseFloat(addValue);
    if (!val || val <= 0) {
      toast.error("Total Assets must be greater than 0.");
      return;
    }
    const key = buildKey(addDate, addTime || "00:00");
    addAssetMetric.mutate(
      { date: key, value: val },
      {
        onSuccess: () => {
          setAddDate("");
          setAddTime("09:00");
          setAddValue("");
        },
      },
    );
  };

  // Edit
  const openEdit = (entry: AssetMetricEntry) => {
    const { date, time } = parseKey(entry.date);
    setEditOriginalKey(entry.date);
    setEditDate(date);
    setEditTime(time);
    setEditValue(String(entry.value));
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDate) {
      toast.error("Please select a date.");
      return;
    }
    const val = Number.parseFloat(editValue);
    if (!val || val <= 0) {
      toast.error("Total Assets must be greater than 0.");
      return;
    }
    const newKey = buildKey(editDate, editTime || "00:00");
    updateAssetMetric.mutate(
      { oldDate: editOriginalKey, newDate: newKey, newValue: val },
      {
        onSuccess: () => setEditDialogOpen(false),
      },
    );
  };

  // Delete
  const confirmDelete = (key: string) => {
    setDeleteKey(key);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    deleteAssetMetric.mutate(deleteKey, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading asset metrics...
      </div>
    );
  }

  return (
    <>
      <Card
        className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
        style={{
          borderImage:
            "linear-gradient(135deg, oklch(var(--vibrant-deep-amber)), oklch(var(--vibrant-gold))) 1",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-vibrant-deep-amber/5 via-transparent to-vibrant-gold/5 pointer-events-none" />
        <CardHeader className="pb-6 relative z-10">
          <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold bg-clip-text text-transparent flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-vibrant-gold" />
            Asset Metrics Manager
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Add daily total asset value entries with IST date &amp; time.
            Returns are calculated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 relative z-10 space-y-8">
          {/* ── Add Entry Form ── */}
          <form onSubmit={handleAdd} className="space-y-5">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold bg-clip-text text-transparent">
              Add Entry
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="am-add-date" className="text-sm font-medium">
                  Date (IST)
                </Label>
                <Input
                  id="am-add-date"
                  type="date"
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  data-ocid="admin.asset_metrics.add_date.input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="am-add-time" className="text-sm font-medium">
                  Time{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (IST)
                  </span>
                </Label>
                <Input
                  id="am-add-time"
                  type="time"
                  value={addTime}
                  onChange={(e) => setAddTime(e.target.value)}
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  data-ocid="admin.asset_metrics.add_time.input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="am-add-value" className="text-sm font-medium">
                  Total Assets (₹)
                </Label>
                <Input
                  id="am-add-value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                  placeholder="e.g. 1500000"
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  data-ocid="admin.asset_metrics.add_value.input"
                  required
                />
              </div>
            </div>

            {/* Return preview */}
            {addPreview !== null && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-vibrant-gold/20 bg-gradient-to-r from-vibrant-deep-amber/5 to-vibrant-gold/5 px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Return % (auto-calculated)
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      addPreview.returnPct > 0
                        ? "text-emerald-400"
                        : addPreview.returnPct < 0
                          ? "text-red-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {addPreview.returnPct >= 0 ? "+" : ""}
                    {addPreview.returnPct.toFixed(4)}%
                  </p>
                </div>
                <div className="rounded-lg border border-vibrant-gold/20 bg-gradient-to-r from-vibrant-deep-amber/5 to-vibrant-gold/5 px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Return Amount (auto-calculated)
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      addPreview.returnAmount > 0
                        ? "text-emerald-400"
                        : addPreview.returnAmount < 0
                          ? "text-red-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {addPreview.returnAmount >= 0 ? "+" : ""}
                    {formatCurrency(addPreview.returnAmount)}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={addAssetMetric.isPending}
              className="bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-8 transition-all"
              data-ocid="admin.asset_metrics.add_button"
            >
              <Plus className="mr-2 h-4 w-4" />
              {addAssetMetric.isPending ? "Adding..." : "Add Entry"}
            </Button>
          </form>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-gold/30 to-transparent" />

          {/* ── Data Table ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold bg-clip-text text-transparent">
              Asset Data
              {displayRows.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({displayRows.length}{" "}
                  {displayRows.length === 1 ? "entry" : "entries"})
                </span>
              )}
            </h3>
            {displayRows.length === 0 ? (
              <div
                className="text-center py-10 text-muted-foreground rounded-lg border border-vibrant-gold/20 bg-gradient-to-r from-vibrant-deep-amber/5 to-vibrant-gold/5"
                data-ocid="admin.asset_metrics.empty_state"
              >
                No asset data yet. Add entries above.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-vibrant-gold/20">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-vibrant-deep-amber/20 to-vibrant-gold/20 border-b border-vibrant-gold/20">
                      <th className="text-left px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Date (IST)
                      </th>
                      <th className="text-left px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Time (IST)
                      </th>
                      <th className="text-right px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Total Assets
                      </th>
                      <th className="text-right px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Return %
                      </th>
                      <th className="text-right px-4 py-3 text-vibrant-gold font-semibold whitespace-nowrap">
                        Return Amount
                      </th>
                      <th className="text-right px-4 py-3 text-vibrant-gold font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map((entry, idx) => {
                      const { date: dStr, time: tStr } = formatIST(entry.date);
                      const isFirst =
                        entry.returnPct === 0 &&
                        entry.returnAmount === 0 &&
                        idx === displayRows.length - 1;
                      return (
                        <tr
                          key={entry.date}
                          className="border-b border-vibrant-gold/10 hover:bg-vibrant-gold/5 transition-colors"
                          data-ocid={`admin.asset_metrics.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 font-medium whitespace-nowrap">
                            {dStr}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {tStr}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold bg-clip-text text-transparent whitespace-nowrap">
                            {formatCurrency(entry.value)}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                              isFirst
                                ? "text-muted-foreground"
                                : entry.returnPct > 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                            }`}
                          >
                            {isFirst
                              ? "—"
                              : `${entry.returnPct >= 0 ? "+" : ""}${entry.returnPct.toFixed(4)}%`}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                              isFirst
                                ? "text-muted-foreground"
                                : entry.returnAmount > 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                            }`}
                          >
                            {isFirst
                              ? "—"
                              : `${entry.returnAmount >= 0 ? "+" : ""}${formatCurrency(entry.returnAmount)}`}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => openEdit(entry)}
                                className="border-vibrant-gold/30 hover:bg-vibrant-gold/10 hover:text-vibrant-gold h-9 w-9 transition-all"
                                data-ocid={`admin.asset_metrics.edit_button.${idx + 1}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => confirmDelete(entry.date)}
                                className="border-destructive/30 text-destructive hover:bg-destructive/10 h-9 w-9"
                                data-ocid={`admin.asset_metrics.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Edit Dialog ── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="border-2 border-transparent shadow-vibrant-glow max-w-md relative overflow-hidden"
          style={{
            borderImage:
              "linear-gradient(135deg, oklch(var(--vibrant-deep-amber)), oklch(var(--vibrant-gold))) 1",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-vibrant-deep-amber/5 via-transparent to-vibrant-gold/5 pointer-events-none" />
          <DialogHeader className="pb-4 relative z-10">
            <DialogTitle className="text-xl bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold bg-clip-text text-transparent">
              Edit Entry
            </DialogTitle>
            <DialogDescription>
              Update the date, time (IST), and total asset value.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="am-edit-date" className="text-sm font-medium">
                Date (IST)
              </Label>
              <Input
                id="am-edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                data-ocid="admin.asset_metrics.edit_date.input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="am-edit-time" className="text-sm font-medium">
                Time{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (IST)
                </span>
              </Label>
              <Input
                id="am-edit-time"
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                data-ocid="admin.asset_metrics.edit_time.input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="am-edit-value" className="text-sm font-medium">
                Total Assets (₹)
              </Label>
              <Input
                id="am-edit-value"
                type="number"
                step="0.01"
                min="0.01"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                data-ocid="admin.asset_metrics.edit_value.input"
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-vibrant-gold/30 h-11"
                data-ocid="admin.asset_metrics.edit_cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAssetMetric.isPending}
                className="bg-gradient-to-r from-vibrant-deep-amber to-vibrant-gold hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 transition-all"
                data-ocid="admin.asset_metrics.edit_save_button"
              >
                {updateAssetMetric.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="border-2 border-transparent shadow-vibrant-glow max-w-sm relative overflow-hidden"
          style={{
            borderImage:
              "linear-gradient(135deg, oklch(var(--vibrant-maroon)), oklch(var(--vibrant-deep-amber))) 1",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-vibrant-deep-amber/5 pointer-events-none" />
          <DialogHeader className="pb-4 relative z-10">
            <DialogTitle className="text-xl text-destructive">
              Delete Entry
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset metric entry? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 relative z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-primary/20 h-11"
              data-ocid="admin.asset_metrics.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deleteAssetMetric.isPending}
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-11 transition-all"
              data-ocid="admin.asset_metrics.delete_confirm_button"
            >
              {deleteAssetMetric.isPending ? "Deleting..." : "Delete Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AssetsManagement() {
  const { data: homeData, isLoading } = useHomePageData();
  const updateAssets = useUpdateAssets();

  const [cash, setCash] = useState("");
  const [bank, setBank] = useState("");
  const [goldWeight, setGoldWeight] = useState("");
  const [goldRate, setGoldRate] = useState("");
  const [silverWeight, setSilverWeight] = useState("");
  const [silverRate, setSilverRate] = useState("");

  useEffect(() => {
    if (homeData?.assetBreakdown) {
      setCash(homeData.assetBreakdown.cash.toString());
      setBank(homeData.assetBreakdown.bank.toString());
      setGoldWeight(homeData.assetBreakdown.gold.weightGrams.toString());
      setGoldRate(homeData.assetBreakdown.gold.ratePerGram.toString());
      setSilverWeight(homeData.assetBreakdown.silver.weightGrams.toString());
      setSilverRate(homeData.assetBreakdown.silver.ratePerGram.toString());
    }
  }, [homeData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssets: AssetCategory = {
      cash: Number.parseFloat(cash),
      bank: Number.parseFloat(bank),
      gold: {
        weightGrams: Number.parseFloat(goldWeight),
        ratePerGram: Number.parseFloat(goldRate),
      },
      silver: {
        weightGrams: Number.parseFloat(silverWeight),
        ratePerGram: Number.parseFloat(silverRate),
      },
    };
    updateAssets.mutate(newAssets);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateGoldValue = () => {
    return (
      Number.parseFloat(goldWeight || "0") * Number.parseFloat(goldRate || "0")
    );
  };

  const calculateSilverValue = () => {
    return (
      Number.parseFloat(silverWeight || "0") *
      Number.parseFloat(silverRate || "0")
    );
  };

  const calculateTotalAssets = () => {
    return (
      Number.parseFloat(cash || "0") +
      Number.parseFloat(bank || "0") +
      calculateGoldValue() +
      calculateSilverValue()
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading assets...
      </div>
    );
  }

  return (
    <Card
      className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
      style={{
        borderImage:
          "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--vibrant-deep-amber))) 1",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-vibrant-gold/5 via-transparent to-vibrant-deep-amber/5 pointer-events-none" />
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-gold to-vibrant-deep-amber bg-clip-text text-transparent">
          Asset Management
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Update the bank's asset values (all amounts in Indian Rupees ₹)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cash" className="text-sm font-medium">
                Cash Holdings (₹)
              </Label>
              <Input
                id="cash"
                type="number"
                step="0.01"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank" className="text-sm font-medium">
                Bank Deposits (₹)
              </Label>
              <Input
                id="bank"
                type="number"
                step="0.01"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-gold/30 to-transparent" />

          <div className="space-y-5">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-vibrant-gold to-vibrant-deep-amber bg-clip-text text-transparent">
              Gold Investments
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goldWeight" className="text-sm font-medium">
                  Weight (grams)
                </Label>
                <Input
                  id="goldWeight"
                  type="number"
                  step="0.01"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(e.target.value)}
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goldRate" className="text-sm font-medium">
                  Rate per gram (₹)
                </Label>
                <Input
                  id="goldRate"
                  type="number"
                  step="0.01"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                  className="border-primary/20 focus:border-vibrant-gold h-11"
                  required
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-gradient-to-r from-vibrant-gold/10 to-vibrant-deep-amber/10 p-3 rounded-lg border border-vibrant-gold/20">
              Calculated Gold Value:{" "}
              <span className="bg-gradient-to-r from-vibrant-gold to-vibrant-deep-amber bg-clip-text text-transparent font-semibold ml-1">
                {formatCurrency(calculateGoldValue())}
              </span>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-maroon/30 to-transparent" />

          <div className="space-y-5">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-vibrant-maroon to-vibrant-royal-blue bg-clip-text text-transparent">
              Silver Investments
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="silverWeight" className="text-sm font-medium">
                  Weight (grams)
                </Label>
                <Input
                  id="silverWeight"
                  type="number"
                  step="0.01"
                  value={silverWeight}
                  onChange={(e) => setSilverWeight(e.target.value)}
                  className="border-primary/20 focus:border-vibrant-royal-blue h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="silverRate" className="text-sm font-medium">
                  Rate per gram (₹)
                </Label>
                <Input
                  id="silverRate"
                  type="number"
                  step="0.01"
                  value={silverRate}
                  onChange={(e) => setSilverRate(e.target.value)}
                  className="border-primary/20 focus:border-vibrant-royal-blue h-11"
                  required
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-gradient-to-r from-vibrant-maroon/10 to-vibrant-royal-blue/10 p-3 rounded-lg border border-vibrant-royal-blue/20">
              Calculated Silver Value:{" "}
              <span className="bg-gradient-to-r from-vibrant-maroon to-vibrant-royal-blue bg-clip-text text-transparent font-semibold ml-1">
                {formatCurrency(calculateSilverValue())}
              </span>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-vibrant-gold/10 via-vibrant-deep-amber/10 to-vibrant-maroon/10 p-4 rounded-lg border border-vibrant-gold/20">
            <div className="text-sm text-muted-foreground">
              Total Assets:{" "}
              <span className="bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent font-semibold text-lg ml-1">
                {formatCurrency(calculateTotalAssets())}
              </span>
            </div>
            <Button
              type="submit"
              disabled={updateAssets.isPending}
              className="bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-8 w-full sm:w-auto transition-all"
            >
              {updateAssets.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AboutContentManagement() {
  const { data: aboutContent, isLoading } = useAboutPageContent();
  const updateAboutContent = useUpdateAboutPageContent();

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (aboutContent) {
      setDescription(aboutContent.description);
    }
  }, [aboutContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutContent.mutate({ description });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading about content...
      </div>
    );
  }

  return (
    <Card
      className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
      style={{
        borderImage:
          "linear-gradient(135deg, oklch(var(--vibrant-deep-amber)), oklch(var(--vibrant-maroon))) 1",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-vibrant-deep-amber/5 via-transparent to-vibrant-maroon/5 pointer-events-none" />
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent">
          About Page Content
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Edit the bank description displayed on the About page
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Bank Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-primary/20 focus:border-vibrant-deep-amber min-h-[300px] text-base leading-relaxed"
              placeholder="Enter the bank description..."
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              This text will be displayed in the "Our Story" section on the
              About page.
            </p>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-maroon/30 to-transparent" />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateAboutContent.isPending}
              className="bg-gradient-to-r from-vibrant-deep-amber to-vibrant-maroon hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-8 transition-all"
            >
              {updateAboutContent.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ShareholdersManagement() {
  const { data: shareholders, isLoading } = useShareholders();
  const updateShareholders = useUpdateShareholders();

  const [shareholderList, setShareholderList] = useState<
    Array<{ name: string; ownershipPercentage: string }>
  >([]);

  useEffect(() => {
    if (shareholders) {
      setShareholderList(
        shareholders.map((s) => ({
          name: s.name,
          ownershipPercentage: s.ownershipPercentage.toString(),
        })),
      );
    }
  }, [shareholders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShareholders.mutate(
      shareholderList.map((s) => ({
        name: s.name,
        ownershipPercentage: Number.parseFloat(s.ownershipPercentage),
      })),
    );
  };

  const updateShareholder = (
    index: number,
    field: "name" | "ownershipPercentage",
    value: string,
  ) => {
    const updated = [...shareholderList];
    updated[index][field] = value;
    setShareholderList(updated);
  };

  const addShareholder = () => {
    setShareholderList([
      ...shareholderList,
      { name: "", ownershipPercentage: "0" },
    ]);
  };

  const removeShareholder = (index: number) => {
    setShareholderList(shareholderList.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading shareholders...
      </div>
    );
  }

  const totalPercentage = shareholderList.reduce(
    (sum, s) => sum + Number.parseFloat(s.ownershipPercentage || "0"),
    0,
  );

  return (
    <Card
      className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
      style={{
        borderImage:
          "linear-gradient(135deg, oklch(var(--vibrant-maroon)), oklch(var(--vibrant-royal-blue))) 1",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-vibrant-maroon/5 via-transparent to-vibrant-royal-blue/5 pointer-events-none" />
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-maroon to-vibrant-royal-blue bg-clip-text text-transparent">
          Shareholder Management
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Update shareholder names and ownership percentages
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {shareholderList.map((shareholder, index) => (
              <div
                key={shareholder.name || `sh-${index}`}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-4 bg-gradient-to-r from-vibrant-maroon/10 to-vibrant-royal-blue/10 rounded-lg border border-vibrant-maroon/20"
              >
                <div className="flex-1 w-full space-y-2">
                  <Label
                    htmlFor={`name-${index}`}
                    className="text-sm font-medium"
                  >
                    Shareholder Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    type="text"
                    value={shareholder.name}
                    onChange={(e) =>
                      updateShareholder(index, "name", e.target.value)
                    }
                    className="border-primary/20 focus:border-vibrant-maroon h-11"
                    required
                  />
                </div>
                <div className="w-full sm:w-40 space-y-2">
                  <Label
                    htmlFor={`percentage-${index}`}
                    className="text-sm font-medium"
                  >
                    Ownership %
                  </Label>
                  <Input
                    id={`percentage-${index}`}
                    type="number"
                    step="0.01"
                    value={shareholder.ownershipPercentage}
                    onChange={(e) =>
                      updateShareholder(
                        index,
                        "ownershipPercentage",
                        e.target.value,
                      )
                    }
                    className="border-primary/20 focus:border-vibrant-royal-blue h-11"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeShareholder(index)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 h-11 w-full sm:w-auto"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addShareholder}
            className="w-full border-vibrant-maroon/30 hover:bg-gradient-to-r hover:from-vibrant-maroon/10 hover:to-vibrant-royal-blue/10 hover:text-vibrant-maroon h-11 transition-all"
          >
            Add Shareholder
          </Button>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-royal-blue/30 to-transparent" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-vibrant-maroon/10 via-vibrant-royal-blue/10 to-vibrant-gold/10 p-4 rounded-lg border border-vibrant-royal-blue/20">
            <div className="text-sm">
              <span className="text-muted-foreground">Total Ownership: </span>
              <span
                className={`font-semibold text-lg ml-1 ${totalPercentage === 100 ? "bg-gradient-to-r from-vibrant-maroon to-vibrant-royal-blue bg-clip-text text-transparent" : "text-destructive"}`}
              >
                {totalPercentage.toFixed(2)}%
              </span>
              {totalPercentage !== 100 && (
                <span className="text-destructive text-xs ml-2 block sm:inline mt-1 sm:mt-0">
                  (Must equal 100%)
                </span>
              )}
            </div>
            <Button
              type="submit"
              disabled={updateShareholders.isPending || totalPercentage !== 100}
              className="bg-gradient-to-r from-vibrant-maroon to-vibrant-royal-blue hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-8 w-full sm:w-auto transition-all"
            >
              {updateShareholders.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function YearlySavingsManagement() {
  const { data: yearlySavings, isLoading } = useYearlySavings();
  const { data: homeData } = useHomePageData();
  const addYearlySaving = useAddYearlySaving();
  const updateYearlySaving = useUpdateYearlySaving();
  const deleteYearlySaving = useDeleteYearlySaving();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<bigint | null>(null);
  const [formData, setFormData] = useState({
    year: "",
    cash: "",
    gold: "",
    silver: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotal = () => {
    const cash = Number.parseFloat(formData.cash || "0");
    const goldWeight = Number.parseFloat(formData.gold || "0");
    const silverWeight = Number.parseFloat(formData.silver || "0");
    const goldRate = homeData?.assetBreakdown.gold.ratePerGram || 0;
    const silverRate = homeData?.assetBreakdown.silver.ratePerGram || 0;
    return cash + goldWeight * goldRate + silverWeight * silverRate;
  };

  const handleOpenDialog = (saving?: YearlySaving) => {
    if (saving) {
      setEditingYear(saving.year);
      setFormData({
        year: Number(saving.year).toString(),
        cash: saving.cash.toString(),
        gold: saving.gold.toString(),
        silver: saving.silver.toString(),
      });
    } else {
      setEditingYear(null);
      setFormData({ year: "", cash: "", gold: "", silver: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingYear(null);
    setFormData({ year: "", cash: "", gold: "", silver: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newSaving: YearlySaving = {
      year: BigInt(formData.year),
      cash: Number.parseFloat(formData.cash),
      gold: Number.parseFloat(formData.gold),
      silver: Number.parseFloat(formData.silver),
      total: calculateTotal(),
    };

    if (editingYear !== null) {
      await updateYearlySaving.mutateAsync({
        year: editingYear,
        updatedSaving: newSaving,
      });
    } else {
      await addYearlySaving.mutateAsync(newSaving);
    }

    handleCloseDialog();
  };

  const handleDelete = async (year: bigint) => {
    if (
      confirm(
        `Are you sure you want to delete the savings record for year ${Number(year)}?`,
      )
    ) {
      await deleteYearlySaving.mutateAsync(year);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading yearly savings...
      </div>
    );
  }

  const sortedSavings = yearlySavings
    ? [...yearlySavings].sort((a, b) => Number(b.year) - Number(a.year))
    : [];

  return (
    <>
      <Card
        className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
        style={{
          borderImage:
            "linear-gradient(135deg, oklch(var(--vibrant-royal-blue)), oklch(var(--vibrant-gold))) 1",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-vibrant-royal-blue/5 via-transparent to-vibrant-gold/5 pointer-events-none" />
        <CardHeader className="pb-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold bg-clip-text text-transparent">
                Yearly Savings Management
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Add, edit, or delete yearly savings records
              </CardDescription>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-6 w-full sm:w-auto transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Year
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 relative z-10">
          {sortedSavings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No yearly savings records yet. Click "Add Year" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSavings.map((saving) => (
                <div
                  key={Number(saving.year)}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 rounded-lg border border-transparent bg-gradient-to-r from-vibrant-royal-blue/10 via-vibrant-gold/10 to-vibrant-deep-amber/10 hover:from-vibrant-royal-blue/15 hover:via-vibrant-gold/15 hover:to-vibrant-deep-amber/15 transition-all gap-4"
                  style={{
                    borderImage:
                      "linear-gradient(90deg, oklch(var(--vibrant-royal-blue)), oklch(var(--vibrant-gold))) 1",
                  }}
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Year
                      </p>
                      <p className="font-semibold bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold bg-clip-text text-transparent text-lg">
                        {Number(saving.year)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Cash
                      </p>
                      <p className="font-medium text-sm">
                        {formatCurrency(saving.cash)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Gold
                      </p>
                      <p className="font-medium text-sm">
                        {saving.gold.toFixed(2)} g
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Silver
                      </p>
                      <p className="font-medium text-sm">
                        {saving.silver.toFixed(2)} g
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Total Value
                      </p>
                      <p className="font-bold bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold bg-clip-text text-transparent text-sm">
                        {formatCurrency(saving.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(saving)}
                      className="border-vibrant-royal-blue/30 hover:bg-vibrant-royal-blue/10 hover:text-vibrant-royal-blue h-10 w-10 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(saving.year)}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="border-2 border-transparent shadow-vibrant-glow max-w-md relative overflow-hidden"
          style={{
            borderImage:
              "linear-gradient(135deg, oklch(var(--vibrant-royal-blue)), oklch(var(--vibrant-gold))) 1",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-vibrant-royal-blue/5 via-transparent to-vibrant-gold/5 pointer-events-none" />
          <DialogHeader className="pb-4 relative z-10">
            <DialogTitle className="text-xl bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold bg-clip-text text-transparent">
              {editingYear !== null
                ? "Edit Yearly Saving"
                : "Add Yearly Saving"}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Enter the savings data for the year. Total value is calculated
              automatically using current gold and silver rates.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="border-primary/20 focus:border-vibrant-royal-blue h-11"
                disabled={editingYear !== null}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cash" className="text-sm font-medium">
                Cash Savings (₹)
              </Label>
              <Input
                id="cash"
                type="number"
                step="0.01"
                value={formData.cash}
                onChange={(e) =>
                  setFormData({ ...formData, cash: e.target.value })
                }
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gold" className="text-sm font-medium">
                Gold Savings (grams)
              </Label>
              <Input
                id="gold"
                type="number"
                step="0.01"
                value={formData.gold}
                onChange={(e) =>
                  setFormData({ ...formData, gold: e.target.value })
                }
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="silver" className="text-sm font-medium">
                Silver Savings (grams)
              </Label>
              <Input
                id="silver"
                type="number"
                step="0.01"
                value={formData.silver}
                onChange={(e) =>
                  setFormData({ ...formData, silver: e.target.value })
                }
                className="border-primary/20 focus:border-vibrant-royal-blue h-11"
                required
              />
            </div>
            <Separator className="bg-gradient-to-r from-transparent via-vibrant-gold/30 to-transparent" />
            <div className="text-sm bg-gradient-to-r from-vibrant-royal-blue/10 to-vibrant-gold/10 p-3 rounded-lg border border-vibrant-gold/20">
              <span className="text-muted-foreground">
                Calculated Total Value:{" "}
              </span>
              <span className="bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold bg-clip-text text-transparent font-semibold ml-1">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-vibrant-royal-blue/30 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  addYearlySaving.isPending || updateYearlySaving.isPending
                }
                className="bg-gradient-to-r from-vibrant-royal-blue to-vibrant-gold hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 transition-all"
              >
                {addYearlySaving.isPending || updateYearlySaving.isPending
                  ? "Saving..."
                  : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ContactManagement() {
  const { data: contactInfo, isLoading } = useContactInfo();
  const updateContactInfo = useUpdateContactInfo();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (contactInfo) {
      setAddress(contactInfo.address);
      setPhone(contactInfo.phone);
      setEmail(contactInfo.email);
    }
  }, [contactInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo.mutate({
      address,
      phone,
      email,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading contact info...
      </div>
    );
  }

  return (
    <Card
      className="border-2 border-transparent shadow-vibrant-glow relative overflow-hidden"
      style={{
        borderImage:
          "linear-gradient(135deg, oklch(var(--vibrant-gold)), oklch(var(--primary))) 1",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-vibrant-gold/5 via-transparent to-primary/5 pointer-events-none" />
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl bg-gradient-to-r from-vibrant-gold to-primary bg-clip-text text-transparent">
          Contact Information Management
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Update the bank's contact details
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Physical Address
              </Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-primary/20 focus:border-vibrant-gold h-11"
                required
              />
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-vibrant-gold/30 to-transparent" />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateContactInfo.isPending}
              className="bg-gradient-to-r from-vibrant-gold to-primary hover:opacity-90 text-primary-foreground shadow-vibrant-glow h-11 px-8 transition-all"
            >
              {updateContactInfo.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

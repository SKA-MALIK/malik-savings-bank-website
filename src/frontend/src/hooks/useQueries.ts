import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ShareValueEntry } from "../backend";
import type {
  AboutPageContent,
  AssetCategory,
  AssetMetricEntry,
  BankInfo,
  ContactInfo,
  HomePageData,
  Shareholder,
  YearlySaving,
} from "../backend";
import { useActor } from "./useActor";

export function useHomePageData() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageData>({
    queryKey: ["homePageData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getHomePageData();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useAssetCategoryBreakdown() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, number]>>({
    queryKey: ["assetCategoryBreakdown"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getAssetCategoryBreakdown();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useShareholders() {
  const { actor, isFetching } = useActor();

  return useQuery<Shareholder[]>({
    queryKey: ["shareholders"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getShareholders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useBankInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<BankInfo>({
    queryKey: ["bankInfo"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getBankInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useAboutPageContent() {
  const { actor, isFetching } = useActor();

  return useQuery<AboutPageContent>({
    queryKey: ["aboutPageContent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getAboutPageContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useYearlySavings() {
  const { actor, isFetching } = useActor();

  return useQuery<YearlySaving[]>({
    queryKey: ["yearlySavings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getAllYearlySavings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

// Mutation hooks for admin operations
export function useUpdateAssets() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAssets: AssetCategory) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateAssets(newAssets);
    },
    onSuccess: async () => {
      // Invalidate and refetch all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["homePageData"] }),
        queryClient.invalidateQueries({ queryKey: ["assetCategoryBreakdown"] }),
        queryClient.invalidateQueries({ queryKey: ["yearlySavings"] }),
      ]);
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["homePageData"] }),
        queryClient.refetchQueries({ queryKey: ["assetCategoryBreakdown"] }),
        queryClient.refetchQueries({ queryKey: ["yearlySavings"] }),
      ]);
      toast.success("Assets updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update assets:", error);
      toast.error(`Failed to update assets: ${error.message}`);
    },
  });
}

export function useUpdateAboutPageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContent: AboutPageContent) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateAboutPageContent(newContent);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["aboutPageContent"] });
      await queryClient.refetchQueries({ queryKey: ["aboutPageContent"] });
      toast.success("About page content updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update about content:", error);
      toast.error(`Failed to update about content: ${error.message}`);
    },
  });
}

export function useUpdateShareholders() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newShareholders: Shareholder[]) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateShareholders(newShareholders);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shareholders"] });
      await queryClient.refetchQueries({ queryKey: ["shareholders"] });
      toast.success("Shareholders updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update shareholders:", error);
      toast.error(`Failed to update shareholders: ${error.message}`);
    },
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContact: ContactInfo) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateContactInfo(newContact);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contactInfo"] }),
        queryClient.invalidateQueries({ queryKey: ["bankInfo"] }),
      ]);
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["contactInfo"] }),
        queryClient.refetchQueries({ queryKey: ["bankInfo"] }),
      ]);
      toast.success("Contact information updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update contact info:", error);
      toast.error(`Failed to update contact info: ${error.message}`);
    },
  });
}

// Yearly Savings mutations
export function useAddYearlySaving() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSaving: YearlySaving) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.addYearlySaving(newSaving);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["yearlySavings"] });
      await queryClient.refetchQueries({ queryKey: ["yearlySavings"] });
      toast.success("Yearly saving added successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to add yearly saving:", error);
      toast.error(`Failed to add yearly saving: ${error.message}`);
    },
  });
}

export function useUpdateYearlySaving() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      year,
      updatedSaving,
    }: { year: bigint; updatedSaving: YearlySaving }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateYearlySaving(year, updatedSaving);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["yearlySavings"] });
      await queryClient.refetchQueries({ queryKey: ["yearlySavings"] });
      toast.success("Yearly saving updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update yearly saving:", error);
      toast.error(`Failed to update yearly saving: ${error.message}`);
    },
  });
}

export function useDeleteYearlySaving() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (year: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.deleteYearlySaving(year);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["yearlySavings"] });
      await queryClient.refetchQueries({ queryKey: ["yearlySavings"] });
      toast.success("Yearly saving deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete yearly saving:", error);
      toast.error(`Failed to delete yearly saving: ${error.message}`);
    },
  });
}

// Asset Metrics hooks
export function useAssetMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<AssetMetricEntry[]>({
    queryKey: ["assetMetrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.getAssetMetrics();
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useAddAssetMetric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, value }: { date: string; value: number }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.addAssetMetric(date, value);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assetMetrics"] });
      await queryClient.refetchQueries({ queryKey: ["assetMetrics"] });
      toast.success("Asset metric added successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to add asset metric:", error);
      toast.error(`Failed to add asset metric: ${error.message}`);
    },
  });
}

export function useUpdateAssetMetric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      oldDate,
      newDate,
      newValue,
    }: {
      oldDate: string;
      newDate: string;
      newValue: number;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.updateAssetMetric(oldDate, newDate, newValue);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assetMetrics"] });
      await queryClient.refetchQueries({ queryKey: ["assetMetrics"] });
      toast.success("Asset metric updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update asset metric:", error);
      toast.error(`Failed to update asset metric: ${error.message}`);
    },
  });
}

export function useDeleteAssetMetric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.deleteAssetMetric(date);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assetMetrics"] });
      await queryClient.refetchQueries({ queryKey: ["assetMetrics"] });
      toast.success("Asset metric deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete asset metric:", error);
      toast.error(`Failed to delete asset metric: ${error.message}`);
    },
  });
}

export function useShareValueHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<ShareValueEntry[]>({
    queryKey: ["shareValueHistory"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getShareValueHistory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useAddShareValueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: ShareValueEntry) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.addShareValueEntry(entry);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shareValueHistory"] });
      await queryClient.refetchQueries({ queryKey: ["shareValueHistory"] });
      toast.success("Share value entry added successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to add share value entry:", error);
      toast.error(`Failed to add share value entry: ${error.message}`);
    },
  });
}

export function useUpdateShareValueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      shareholderName,
      newAmount,
    }: {
      date: string;
      shareholderName: string;
      newAmount: number;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.updateShareValueEntry(
        date,
        shareholderName,
        newAmount,
      );
      if (!result) throw new Error("Entry not found");
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shareValueHistory"] });
      await queryClient.refetchQueries({ queryKey: ["shareValueHistory"] });
      toast.success("Share value entry updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update share value entry:", error);
      toast.error(`Failed to update share value entry: ${error.message}`);
    },
  });
}

export function useDeleteShareValueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      shareholderName,
    }: {
      date: string;
      shareholderName: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.deleteShareValueEntry(date, shareholderName);
      if (!result) throw new Error("Entry not found");
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shareValueHistory"] });
      await queryClient.refetchQueries({ queryKey: ["shareValueHistory"] });
      toast.success("Share value entry deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete share value entry:", error);
      toast.error(`Failed to delete share value entry: ${error.message}`);
    },
  });
}

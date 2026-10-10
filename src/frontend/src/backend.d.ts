import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface BankInfo {
    contact: ContactInfo;
    name: string;
    foundingDate: Time;
}
export interface AssetCategory {
    bank: number;
    cash: number;
    gold: PreciousMetal;
    silver: PreciousMetal;
}
export interface ShareValueEntry {
    date: string;
    shareholderName: string;
    shareAmount: number;
}
export interface PreciousMetal {
    ratePerGram: number;
    weightGrams: number;
}
export interface Shareholder {
    name: string;
    ownershipPercentage: number;
}
export interface YearlySaving {
    total: number;
    cash: number;
    gold: number;
    year: bigint;
    silver: number;
}
export interface HomePageData {
    totalAssets: number;
    assetBreakdown: AssetCategory;
}
export interface AboutPageContent {
    description: string;
}
export interface ContactInfo {
    email: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    username: string;
    name: string;
}
export interface AssetMetricEntry {
    value: number;
    date: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAssetMetric(entryDate: string, entryValue: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addShareValueEntry(entry: ShareValueEntry): Promise<void>;
    addYearlySaving(newSaving: YearlySaving): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAssetMetric(entryDate: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteShareValueEntry(date: string, shareholderName: string): Promise<boolean>;
    deleteYearlySaving(year: bigint): Promise<void>;
    getAboutPageContent(): Promise<AboutPageContent>;
    getAllYearlySavings(): Promise<Array<YearlySaving>>;
    getAssetCategoryBreakdown(): Promise<Array<[string, number]>>;
    getAssetMetrics(): Promise<Array<AssetMetricEntry>>;
    getBankInfo(): Promise<BankInfo>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getHomePageData(): Promise<HomePageData>;
    getShareValueHistory(): Promise<Array<ShareValueEntry>>;
    getShareholders(): Promise<Array<Shareholder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getYearsOfOperation(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAboutPageContent(newContent: AboutPageContent): Promise<void>;
    updateAssetMetric(oldDate: string, newDate: string, newValue: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateAssets(newAssets: AssetCategory): Promise<void>;
    updateContactInfo(newContact: ContactInfo): Promise<void>;
    updateShareValueEntry(date: string, shareholderName: string, newAmount: number): Promise<boolean>;
    updateShareholders(newShareholders: Array<Shareholder>): Promise<void>;
    updateYearlySaving(year: bigint, updatedSaving: YearlySaving): Promise<void>;
}

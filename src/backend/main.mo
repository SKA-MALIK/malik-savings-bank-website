import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Debug "mo:core/Debug";

actor {
  // Include access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Shareholder = {
    name : Text;
    ownershipPercentage : Float;
  };

  public type PreciousMetal = {
    weightGrams : Float;
    ratePerGram : Float;
  };

  public type AssetCategory = {
    cash : Float;
    bank : Float;
    gold : PreciousMetal;
    silver : PreciousMetal;
  };

  public type ContactInfo = {
    address : Text;
    phone : Text;
    email : Text;
  };

  public type BankInfo = {
    name : Text;
    foundingDate : Time.Time;
    contact : ContactInfo;
  };

  public type HomePageData = {
    totalAssets : Float;
    assetBreakdown : AssetCategory;
  };

  public type AboutPageContent = {
    description : Text;
  };

  public type YearlySaving = {
    year : Nat;
    cash : Float;
    gold : Float;
    silver : Float;
    total : Float;
  };

  public type AssetMetricEntry = {
    date : Text;
    value : Float;
  };

  public type ShareValueEntry = {
    date : Text;
    shareholderName : Text;
    shareAmount : Float;
  };

  public type UserProfile = {
    name : Text;
    username : Text;
  };

  var shareValueHistory : [ShareValueEntry] = [];

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  var assets : AssetCategory = {
    cash = 500_000.00;
    bank = 1_200_000.00;
    gold = {
      weightGrams = 500.0;
      ratePerGram = 6000.0;
    };
    silver = {
      weightGrams = 2000.0;
      ratePerGram = 70.0;
    };
  };

  var shareholders = [
    { name = "Malik Family"; ownershipPercentage = 40.0 },
    { name = "Alpha Investments"; ownershipPercentage = 25.0 },
    { name = "Beta Holdings"; ownershipPercentage = 20.0 },
    { name = "Gamma Partners"; ownershipPercentage = 10.0 },
    { name = "Other Investors"; ownershipPercentage = 5.0 },
  ];

  var bankInfo : BankInfo = {
    name = "Malik Savings Bank";
    foundingDate = 1519084800000000000 : Int;
    contact = {
      address = "123 Main Street, Anytown, 12345";
      phone = "+123 456 7890";
      email = "info@maliksavings.com";
    };
  };

  var aboutPageContent : AboutPageContent = {
    description = "Malik Savings Bank is a trusted bank with a strong commitment to financial stability and customer service. Founded on February 20th, 2018, we have been serving clients for over 5 years. Our core philosophy is to provide reliable banking services and smart investment opportunities, all while maintaining the highest standards of integrity and security. Malik Savings Bank is registered as a privately owned financial entity. Our dedicated team is passionate about helping you achieve your financial goals. Thank you for choosing Malik Savings Bank as your partner in financial success.";
  };

  var yearlySavings = [
    {
      year = 2018;
      cash = 100000.0;
      gold = 50.0;
      silver = 100.0;
      total = 500000.0;
    },
    {
      year = 2019;
      cash = 150000.0;
      gold = 75.0;
      silver = 150.0;
      total = 750000.0;
    },
    {
      year = 2020;
      cash = 200000.0;
      gold = 100.0;
      silver = 200.0;
      total = 1000000.0;
    },
  ];

  var assetMetrics : [AssetMetricEntry] = [];

  func filterYearlySavings(array : [YearlySaving], predicate : (YearlySaving) -> Bool) : [YearlySaving] {
    let varArray = array.values().toArray();
    let filteredVarArray = varArray.filter(predicate);
    filteredVarArray.values().toArray();
  };
  func concatYearlySavings(array1 : [YearlySaving], array2 : [YearlySaving]) : [YearlySaving] {
    let varArray1 = array1.values().toArray();
    let varArray2 = array2.values().toArray();
    let concatenated = varArray1.concat(varArray2);
    concatenated.values().toArray();
  };

  public query ({ caller }) func getHomePageData() : async HomePageData {
    let totalAssets = assets.cash + assets.bank + calculateGoldValue() + calculateSilverValue();
    {
      totalAssets;
      assetBreakdown = assets;
    };
  };

  public shared ({ caller }) func updateAssets(newAssets : AssetCategory) : async () {
    assets := newAssets;
  };

  func calculateGoldValue() : Float {
    assets.gold.weightGrams * assets.gold.ratePerGram;
  };

  func calculateSilverValue() : Float {
    assets.silver.weightGrams * assets.silver.ratePerGram;
  };

  public query ({ caller }) func getShareholders() : async [Shareholder] {
    shareholders;
  };

  public shared ({ caller }) func updateShareholders(newShareholders : [Shareholder]) : async () {
    shareholders := newShareholders;
  };

  public query ({ caller }) func getContactInfo() : async ContactInfo {
    bankInfo.contact;
  };

  public shared ({ caller }) func updateContactInfo(newContact : ContactInfo) : async () {
    let currentBankInfo = bankInfo;
    bankInfo := {
      currentBankInfo with contact = newContact;
    };
  };

  public query ({ caller }) func getAboutPageContent() : async AboutPageContent {
    aboutPageContent;
  };

  public shared ({ caller }) func updateAboutPageContent(newContent : AboutPageContent) : async () {
    aboutPageContent := newContent;
  };

  public query ({ caller }) func getBankInfo() : async BankInfo {
    bankInfo;
  };

  public query ({ caller }) func getYearsOfOperation() : async Int {
    let foundingYear = 2018;
    let currentYear = 2024;
    currentYear - foundingYear;
  };

  public query ({ caller }) func getAssetCategoryBreakdown() : async [(Text, Float)] {
    let goldValue = calculateGoldValue();
    let silverValue = calculateSilverValue();
    let totalAssets = assets.cash + assets.bank + goldValue + silverValue;

    if (totalAssets == 0.0) {
      return [("cash", 0.0), ("bank", 0.0), ("gold", 0.0), ("silver", 0.0)];
    };

    let categoryData = [
      ("cash", roundToTwoDecimals(assets.cash / totalAssets * 100.0)),
      ("bank", roundToTwoDecimals(assets.bank / totalAssets * 100.0)),
      ("gold", roundToTwoDecimals(goldValue / totalAssets * 100.0)),
      ("silver", roundToTwoDecimals(silverValue / totalAssets * 100.0)),
    ];

    categoryData;
  };

  func roundToTwoDecimals(value : Float) : Float {
    (value * 100.0).toInt().toFloat() / 100.0;
  };

  func calculateAssetPercentage(amount : Float, total : Float) : Float {
    if (total == 0.0) { return 0.0 };
    roundToTwoDecimals((amount / total) * 100.0);
  };

  public query ({ caller }) func getAllYearlySavings() : async [YearlySaving] {
    yearlySavings;
  };

  public shared ({ caller }) func addYearlySaving(newSaving : YearlySaving) : async () {
    let existing = yearlySavings.find(func(s) { s.year == newSaving.year });
    switch (existing) {
      case (?_) { return };
      case (null) {
        yearlySavings := concatYearlySavings(yearlySavings, [newSaving]);
      };
    };
  };

  public shared ({ caller }) func updateYearlySaving(year : Nat, updatedSaving : YearlySaving) : async () {
    let index = yearlySavings.findIndex(func(s) { s.year == year });
    switch (index) {
      case (?i) {
        let updatedArray = yearlySavings.toVarArray<YearlySaving>();
        updatedArray[i] := updatedSaving;
        yearlySavings := updatedArray.values().toArray();
      };
      case (null) { return };
    };
  };

  public shared ({ caller }) func deleteYearlySaving(year : Nat) : async () {
    let exists = yearlySavings.find(func(s) { s.year == year }) != null;
    if (not exists) { return };
    yearlySavings := filterYearlySavings(yearlySavings, func(s) { s.year != year });
  };

  public query func getAssetMetrics() : async [AssetMetricEntry] {
    assetMetrics.sort(func(a : AssetMetricEntry, b : AssetMetricEntry) : Order.Order {
      Text.compare(a.date, b.date)
    });
  };

  public shared ({ caller }) func addAssetMetric(entryDate : Text, entryValue : Float) : async { #ok; #err : Text } {
    if (entryValue <= 0.0) {
      return #err("Value must be greater than 0");
    };
    let exists = assetMetrics.find(func(e : AssetMetricEntry) : Bool { e.date == entryDate });
    switch (exists) {
      case (?_) { return #err("A metric entry for this date already exists") };
      case null {
        let newEntry : AssetMetricEntry = { date = entryDate; value = entryValue };
        let combined = assetMetrics.concat([newEntry]);
        assetMetrics := combined.sort(func(a : AssetMetricEntry, b : AssetMetricEntry) : Order.Order {
          Text.compare(a.date, b.date)
        });
        #ok;
      };
    };
  };

  public shared ({ caller }) func updateAssetMetric(oldDate : Text, newDate : Text, newValue : Float) : async { #ok; #err : Text } {
    if (newValue <= 0.0) { return #err("Value must be greater than 0") };
    if (newDate != oldDate) {
      let conflict = assetMetrics.find(func(e : AssetMetricEntry) : Bool { e.date == newDate });
      switch (conflict) {
        case (?_) { return #err("A metric entry for the new date already exists") };
        case null {};
      };
    };
    let index = assetMetrics.findIndex(func(e : AssetMetricEntry) : Bool { e.date == oldDate });
    switch (index) {
      case null { return #err("Entry not found") };
      case (?i) {
        let updatedVar = assetMetrics.toVarArray<AssetMetricEntry>();
        updatedVar[i] := { date = newDate; value = newValue };
        assetMetrics := updatedVar.values().toArray().sort(
          func(a : AssetMetricEntry, b : AssetMetricEntry) : Order.Order { Text.compare(a.date, b.date) }
        );
        #ok;
      };
    };
  };

  public shared ({ caller }) func deleteAssetMetric(entryDate : Text) : async { #ok; #err : Text } {
    let exists = assetMetrics.find(func(e : AssetMetricEntry) : Bool { e.date == entryDate });
    switch (exists) {
      case null { return #err("Entry not found") };
      case (?_) {
        assetMetrics := assetMetrics.filter(func(e : AssetMetricEntry) : Bool { e.date != entryDate });
        #ok;
      };
    };
  };
  public query func getShareValueHistory() : async [ShareValueEntry] {
    shareValueHistory;
  };

  public shared func addShareValueEntry(entry : ShareValueEntry) : async () {
    shareValueHistory := shareValueHistory.concat([entry]);
  };

  public shared func updateShareValueEntry(date : Text, shareholderName : Text, newAmount : Float) : async Bool {
    let index = shareValueHistory.findIndex(func(e : ShareValueEntry) : Bool {
      e.date == date and e.shareholderName == shareholderName
    });
    switch (index) {
      case null { false };
      case (?i) {
        let updatedVar = shareValueHistory.toVarArray<ShareValueEntry>();
        updatedVar[i] := { date; shareholderName; shareAmount = newAmount };
        shareValueHistory := updatedVar.values().toArray();
        true;
      };
    };
  };

  public shared func deleteShareValueEntry(date : Text, shareholderName : Text) : async Bool {
    let exists = shareValueHistory.find(func(e : ShareValueEntry) : Bool {
      e.date == date and e.shareholderName == shareholderName
    });
    switch (exists) {
      case null { false };
      case (?_) {
        shareValueHistory := shareValueHistory.filter(func(e : ShareValueEntry) : Bool {
          not (e.date == date and e.shareholderName == shareholderName)
        });
        true;
      };
    };
  };
};

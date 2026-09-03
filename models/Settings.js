import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  popularSection: { type: Boolean, default: true },
  upcomingSection: { type: Boolean, default: true },
  destinationsSection: { type: Boolean, default: true },
  exploreSection: { type: Boolean, default: true },
  testimonialsSection: { type: Boolean, default: true },
  
  // Social Media Settings
  facebookUrl: { type: String, default: "" },
  facebookEnabled: { type: Boolean, default: true },
  instagramUrl: { type: String, default: "" },
  instagramEnabled: { type: Boolean, default: true },
  twitterUrl: { type: String, default: "" },
  twitterEnabled: { type: Boolean, default: true },
  linkedinUrl: { type: String, default: "" },
  linkedinEnabled: { type: Boolean, default: true },
  youtubeUrl: { type: String, default: "" },
  youtubeEnabled: { type: Boolean, default: true },
  whatsappUrl: { type: String, default: "" },
  whatsappEnabled: { type: Boolean, default: true },

  // Custom display names for experience types and pages (keyed by slug)
  groupLabelOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },
  categoryLabelOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },

  // User-added experience types and pages
  customGroups: { type: mongoose.Schema.Types.Mixed, default: [] },
  customSubcategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  customMiniCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  miniCategoryLabelOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },
  hiddenGroups: { type: [String], default: [] },
  hiddenSubcategories: { type: [String], default: [] },
  hiddenMiniCategories: { type: [String], default: [] },
}, { timestamps: true });

if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model('Settings', SettingsSchema);

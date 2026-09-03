import dbConnect from '../../lib/mongodb';
import Settings from '../../models/Settings';
import { EXPLORE_SECTION_DEFAULTS } from '../../lib/exploreSectionDefaults';

const SETTINGS_DEFAULTS = {
  popularSection: true,
  upcomingSection: true,
  destinationsSection: true,
  exploreSection: true,
  testimonialsSection: true,
  facebookUrl: '',
  facebookEnabled: true,
  instagramUrl: '',
  instagramEnabled: true,
  twitterUrl: '',
  twitterEnabled: true,
  linkedinUrl: '',
  linkedinEnabled: true,
  youtubeUrl: '',
  youtubeEnabled: true,
  whatsappUrl: '',
  whatsappEnabled: true,
  offerPopupEnabled: false,
  offerPopupTitle: '',
  offerPopupSubtitle: '',
  offerPopupImageUrl: '',
  offerPopupImagePublicId: '',
  offerPopupInitialDelaySeconds: 3,
  offerPopupRepeatIntervalSeconds: 320,
  offerPopupAspectRatio: 'landscape',
  exploreEyebrow: EXPLORE_SECTION_DEFAULTS.exploreEyebrow,
  exploreHeadingLine1: EXPLORE_SECTION_DEFAULTS.exploreHeadingLine1,
  exploreHeadingLine2: EXPLORE_SECTION_DEFAULTS.exploreHeadingLine2,
  exploreSubtitle: EXPLORE_SECTION_DEFAULTS.exploreSubtitle,
  exploreInclusions: [...EXPLORE_SECTION_DEFAULTS.exploreInclusions],
  exploreCtaLabel: EXPLORE_SECTION_DEFAULTS.exploreCtaLabel,
  explorePhone: EXPLORE_SECTION_DEFAULTS.explorePhone,
  explorePhoneLabel: EXPLORE_SECTION_DEFAULTS.explorePhoneLabel,
};

function applySettingsDefaults(settings) {
  let changed = false;
  for (const [key, value] of Object.entries(SETTINGS_DEFAULTS)) {
    if (settings[key] === undefined || settings[key] === null) {
      settings[key] = value;
      changed = true;
    }
  }
  return changed;
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        let settings = await Settings.findOne().lean();
        if (!settings) {
          settings = await Settings.create(SETTINGS_DEFAULTS);
          settings = settings.toObject ? settings.toObject() : settings;
        } else {
          // Apply defaults in-memory only on GET — avoid a write on every page load
          const merged = { ...SETTINGS_DEFAULTS, ...settings };
          settings = merged;
        }
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=30, stale-while-revalidate=120'
        );
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = await Settings.create(req.body);
        } else {
          settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
            new: true,
            runValidators: true,
          });
        }
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

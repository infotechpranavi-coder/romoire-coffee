import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';
import { yachtPackageSeedData } from '../../../lib/yachtPackageData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (!isConnected()) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const results = { created: [], updated: [], errors: [] };

    for (const pkg of yachtPackageSeedData) {
      try {
        const existing = await Package.findOne({ title: pkg.title });
        if (existing) {
          await Package.findByIdAndUpdate(
            existing._id,
            { $set: { ...pkg, updatedAt: new Date() } },
            { new: true, runValidators: true }
          );
          results.updated.push(pkg.title);
        } else {
          await Package.create(pkg);
          results.created.push(pkg.title);
        }
      } catch (error) {
        results.errors.push({ title: pkg.title, error: error.message });
      }
    }

    const all = await Package.find({
      title: { $in: yachtPackageSeedData.map((p) => p.title) },
    }).lean();

    res.status(200).json({
      success: true,
      message: 'Yacht packages seeded',
      results: {
        created: results.created.length,
        updated: results.updated.length,
        errors: results.errors.length,
      },
      details: results,
      data: all,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

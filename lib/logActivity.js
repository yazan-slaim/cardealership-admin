import { Activity } from "@/models/Activity";
import { connectMongoDB } from "@/lib/mongodb";
import { getDealershipId } from "@/lib/getDealershipScope";

/**
 * Log an activity to the Activity collection.
 * Designed to be fire-and-forget — errors are caught and logged,
 * never thrown, so they don't break the parent request.
 *
 * @param {Object} opts
 * @param {string}  opts.type           - Activity type (e.g. "sale_recorded", "car_added")
 * @param {string}  [opts.clientId]     - Related Client ObjectId (optional)
 * @param {string}  [opts.carId]        - Related Car ObjectId (optional)
 * @param {Object}  [opts.metadata]     - Free-form metadata (e.g. { contentPreview, salePrice })
 * @param {string}  [opts.performedBy]  - Employee or Client ObjectId who performed the action
 * @param {string}  [opts.performedByModel] - "Employee" | "Client"
 * @param {string}  [opts.source]       - "employee" | "client" | "system"
 */
export async function logActivity({
  type,
  clientId = null,
  carId = null,
  metadata = {},
  performedBy = null,
  performedByModel = null,
  source = "system",
}) {
  try {
    await connectMongoDB();
    const dealershipId = await getDealershipId();
    await Activity.create({
      type,
      dealershipId,
      client: clientId || undefined,
      carId: carId || undefined,
      metadata,
      performedBy: performedBy || undefined,
      performedByModel: performedByModel || undefined,
      source,
    });
  } catch (err) {
    // Never let activity logging break the parent request
    console.error("[logActivity] Failed to log activity:", err.message);
  }
}

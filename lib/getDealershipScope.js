import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Returns the dealership scope filter object for MongoDB queries.
 * @param {Object} [session] Optional session object if already fetched, otherwise fetches it.
 * @returns {Promise<Object>} The MongoDB filter object, e.g., { dealershipId: "..." } or {} for global admin.
 */
export async function getDealershipScope(session = null) {
  const currentSession = session || await getServerSession(authOptions);
  
  if (!currentSession?.user) {
    // If not authenticated, returning a dummy filter that won't match to be safe
    return { _id: null }; 
  }

  const { role, dealershipId } = currentSession.user;

  // Global admin sees all data
  if (role === "admin" && !dealershipId) {
    return {};
  }

  // Tenant-scoped user
  if (dealershipId) {
    return { dealershipId };
  }

  // Fallback if neither applies
  return { _id: null };
}

/**
 * Returns just the dealershipId string or null
 * @param {Object} [session] Optional session object
 * @returns {Promise<String|null>}
 */
export async function getDealershipId(session = null) {
  const currentSession = session || await getServerSession(authOptions);
  return currentSession?.user?.dealershipId || null;
}

import connectDb from "../config/db";
import User from "../models/User";
import ServiceProvider from "../models/ServiceProvider";
import Booking from "../models/Booking";

function isValidPoint(obj) {
  return (
    obj &&
    obj.type === "Point" &&
    Array.isArray(obj.coordinates) &&
    obj.coordinates.length === 2 &&
    typeof obj.coordinates[0] === "number" &&
    typeof obj.coordinates[1] === "number"
  );
}

async function fixUsers() {
  const users = await User.find({});
  let updated = 0;
  for (const u of users) {
    let changed = false;

    if (u.location && u.location.coordinates) {
      if (!isValidPoint(u.location.coordinates)) {
        // Try to recover from common mistakes
        const c = u.location.coordinates;
        if (
          c &&
          typeof c.longitude === "number" &&
          typeof c.latitude === "number"
        ) {
          u.location.coordinates = {
            type: "Point",
            coordinates: [c.longitude, c.latitude],
          };
          changed = true;
        } else if (
          c &&
          typeof c.lng === "number" &&
          typeof c.lat === "number"
        ) {
          u.location.coordinates = {
            type: "Point",
            coordinates: [c.lng, c.lat],
          };
          changed = true;
        } else if (
          Array.isArray(c) &&
          c.length === 2 &&
          typeof c[0] === "number" &&
          typeof c[1] === "number"
        ) {
          u.location.coordinates = { type: "Point", coordinates: c };
          changed = true;
        } else {
          // Unset invalid coordinates; keep address fields
          u.location.coordinates = undefined;
          changed = true;
        }
      }
    }

    if (changed) {
      await u.save();
      updated++;
    }
  }
  return updated;
}

async function fixServiceProviders() {
  const sps = await ServiceProvider.find({});
  let updated = 0;
  for (const sp of sps) {
    if (Array.isArray(sp.serviceAreas)) {
      const before = sp.serviceAreas.length;
      sp.serviceAreas = sp.serviceAreas
        .map((sa) => {
          if (!sa || !sa.location) return null;
          const loc = sa.location;
          if (isValidPoint(loc)) return sa;

          // try recovery for common shapes
          if (
            loc &&
            typeof loc.longitude === "number" &&
            typeof loc.latitude === "number"
          ) {
            return {
              ...sa.toObject?.() ?? sa,
              location: {
                type: "Point",
                coordinates: [loc.longitude, loc.latitude],
              },
            };
          }
          if (
            loc &&
            typeof loc.lng === "number" &&
            typeof loc.lat === "number"
          ) {
            return {
              ...sa.toObject?.() ?? sa,
              location: {
                type: "Point",
                coordinates: [loc.lng, loc.lat],
              },
            };
          }
          if (
            Array.isArray(loc) &&
            loc.length === 2 &&
            typeof loc[0] === "number" &&
            typeof loc[1] === "number"
          ) {
            return {
              ...sa.toObject?.() ?? sa,
              location: { type: "Point", coordinates: loc },
            };
          }
          return null; // drop invalid entry
        })
        .filter(Boolean);
      if (sp.serviceAreas.length !== before) {
        await sp.save();
        updated++;
      }
    }
  }
  return updated;
}

async function fixBookings() {
  const bookings = await Booking.find({});
  let updated = 0;
  for (const b of bookings) {
    if (b.serviceLocation && b.serviceLocation.coordinates) {
      const c = b.serviceLocation.coordinates;
      if (!isValidPoint(c)) {
        if (
          c &&
          typeof c.longitude === "number" &&
          typeof c.latitude === "number"
        ) {
          b.serviceLocation.coordinates = {
            type: "Point",
            coordinates: [c.longitude, c.latitude],
          };
        } else if (
          Array.isArray(c) &&
          c.length === 2 &&
          typeof c[0] === "number" &&
          typeof c[1] === "number"
        ) {
          b.serviceLocation.coordinates = { type: "Point", coordinates: c };
        } else {
          b.serviceLocation.coordinates = undefined; // unset invalid
        }
        await b.save();
        updated++;
      }
    }
  }
  return updated;
}

(async () => {
  try {
    await connectDb();
    const u = await fixUsers();
    const s = await fixServiceProviders();
    const b = await fixBookings();
    console.log(`Geo cleanup complete. Users updated: ${u}, Providers updated: ${s}, Bookings updated: ${b}`);
    process.exit(0);
  } catch (err) {
    console.error("Geo cleanup failed:", err);
    process.exit(1);
  }
})();

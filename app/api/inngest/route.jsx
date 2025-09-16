import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// Ensure Node.js runtime (Edge can have DNS restrictions that break MongoDB SRV lookups)
export const runtime = "nodejs";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});
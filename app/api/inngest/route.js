import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// Create an API that serves Inngest functions
const handler = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
  streaming: false,
});

// Export HTTP methods
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
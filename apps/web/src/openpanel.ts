import { OpenPanel } from "@openpanel/web";

export const op = new OpenPanel({
  apiUrl: "https://analytics.zias.be/api",
  clientId: "6655ca1e-c29b-4147-8d68-79d04c333b60",
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
});

import handler, {
  createScheduledHandler,
  PluginBridge,
} from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

/** While the site is being redesigned, every public URL lands on this page. */
const UNDER_CONSTRUCTION = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Zias</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1rem;line-height:1.5}</style>
</head>
<body>
<h1>Under construction</h1>
<p>The new site is on its way. Until then: <a href="mailto:hello@zias.be">hello@zias.be</a></p>
</body>
</html>`;

export default {
  ...handler,
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    // Keep the CMS admin reachable.
    if (pathname.startsWith("/_emdash")) {
      return handler.fetch(request, env, ctx);
    }
    if (pathname !== "/") {
      return Response.redirect(new URL("/", request.url), 302);
    }
    return new Response(UNDER_CONSTRUCTION, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  },
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;

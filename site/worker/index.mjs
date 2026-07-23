const WIRE_RUNNER_ORIGIN = 'https://wire-runner.jabach0811.chatgpt.site';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.pathname === '/wire-runner' ||
      url.pathname.startsWith('/wire-runner/')
    ) {
      const suffix = url.pathname.slice('/wire-runner'.length) || '/';
      const destination = new URL(suffix, `${WIRE_RUNNER_ORIGIN}/`);
      destination.search = url.search;

      return Response.redirect(destination.toString(), 308);
    }

    if (url.pathname === '/') {
      url.pathname = '/index.html';
    }

    return env.ASSETS.fetch(new Request(url, request));
  }
};

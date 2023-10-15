import node from '@remix-run/node';
import {
  sendRemixResponse,
  createRemixRequest,
} from '@remix-run/express/dist/server.js';

export function createRequestHandler({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
  beforeResponse,
}) {
  let handleRequest = node.createRequestHandler(build, mode);
  return async (req, res, next) => {
    try {
      let request = createRemixRequest(req, res);
      let loadContext = await (getLoadContext === null ||
      getLoadContext === void 0
        ? void 0
        : getLoadContext(req, res));
      let response = await handleRequest(request, loadContext);
      beforeResponse && (await beforeResponse());
      await sendRemixResponse(res, response);
    } catch (error) {
      next(error);
    }
  };
}

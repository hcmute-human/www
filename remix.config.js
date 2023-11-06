/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  postcss: true,
  tailwind: true,
  serverDependenciesToBundle: ['remix-i18next', /date-fns.*/],
};

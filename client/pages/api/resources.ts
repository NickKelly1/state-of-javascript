import { NextApiHandler } from "next";
import { apiHandler } from "../../src/helpers/api-handler.helper";
import { ResourceSdkResource } from "../../src/sdk/types/resource.sdk.resource";

const resources = apiHandler<ResourceSdkResource[]>(async ({ req, res, sdk }) => {
  const resources = await sdk.resources();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(resources);
});

export default resources;
import { NextApiHandler } from "next";
import { apiHandler } from "../../src/helpers/api-handler.helper";
import { ResourceCmsResource } from "../../src/cms/types/resource.cms.resource";

const resources = apiHandler<ResourceCmsResource[]>(async ({ req, res, cms }) => {
  const resources = await cms.resources({});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(resources);
});

export default resources;
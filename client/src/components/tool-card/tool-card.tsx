import React, { useMemo } from 'react';
import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { ArticleSdkResource } from '../../sdk/types/article.sdk.resource';
import { formatRelative } from 'date-fns';
import { InlineSdkImg } from '../inline-sdk-img/inline-sdk-img';
import { MaybeLink } from '../maybe-link/maybe-link';
import { InfoCard } from '../info-card/info-card';
import { InfoCardHeader } from '../info-card-header/info-card-header';
import { InfoCardSubtitle } from '../info-card-subtitle/info-card-subtitle';
import { InfoCardBody } from '../info-card-body/info-card-body';
import { InfoCardTitle } from '../info-card-title/info-card-title';
import { InfoCardCategory } from '../info-card-category/info-card-category';
import { ResourceSdkResource } from '../../sdk/types/resource.sdk.resource';
import { SdkImg } from '../sdk-img/sdk-img';

const useStyles = makeStyles((theme) => ({
  img: {
    maxWidth: '100%',
  }
}));

export interface IToolCardProps {
  tool: ResourceSdkResource;
}

export function ToolCard(props: IToolCardProps) {
  const { tool } = props;
  const classes = useStyles();

  return (
    <InfoCard style={{ height: '100%' }}>
      <InfoCardHeader>
        <InfoCardTitle
          title={tool.name}
          icon={tool.logo?.url ?? tool.logo?.url}
          link={tool.link}
        />
        <InfoCardCategory>
          Tooling
        </InfoCardCategory>
      </InfoCardHeader>
      <InfoCardBody>
        <Box mb={2}>
          <Typography variant="body2" component="p" color="inherit">
            {tool.description}
          </Typography>
        </Box>
        {tool.example?.url && (<SdkImg className={classes.img} src={tool.example?.url} />)}
      </InfoCardBody>
    </InfoCard>
  );
}
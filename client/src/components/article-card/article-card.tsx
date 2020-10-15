import React, { useMemo, useState } from 'react';
import { Box, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { ArticleCmsResource } from '../../cms/types/article.cms.resource';
import { formatRelative } from 'date-fns';
import { InfoCard } from '../info-card/info-card';
import { InfoCardHeader } from '../info-card-header/info-card-header';
import { InfoCardSubtitle } from '../info-card-subtitle/info-card-subtitle';
import { InfoCardBody } from '../info-card-body/info-card-body';
import { InfoCardTitle } from '../info-card-title/info-card-title';
import { InfoCardCategory } from '../info-card-category/info-card-category';
import { Markdown } from '../markdown/markdown';

const useStyles = makeStyles((theme) => ({
  more: {
    // paddingLeft: 0,
    marginTop: theme.spacing(1),
  }
}));

export interface IArticleCardProps {
  article: ArticleCmsResource;
}

export function ArticleCard(props: IArticleCardProps) {
  const { article } = props;
  const classes = useStyles();
  const [more, setMore] = useState(false);
  const updated = useMemo(() => {
    const now = new Date();
    const relative = formatRelative(new Date(article.updated_at), now);
    return relative;
  }, [article.updated_at]);

  return (
    <InfoCard>
      <InfoCardHeader>
        <InfoCardTitle
          title={article.title}
          icon={article.icon?.url ?? article.topic?.icon?.url}
          link={article.source}
        />
        <InfoCardCategory>
          News
        </InfoCardCategory>
      </InfoCardHeader>
      <InfoCardSubtitle>
        <Typography variant="body2" component="p" color="secondary">
          {`Updated ${updated}`}
        </Typography>
      </InfoCardSubtitle>
      <InfoCardBody>
        <Typography variant="body2" component="p" color="inherit">
          {article.description}
        </Typography>
        {article.teaser && (
          <>
            <Button className={classes.more} onClick={() => setMore(!more)}>
              <u>
                {!more && ( 'More...')}
                {more && ( 'Less...')}
              </u>
            </Button>
            {more && (
              <div>
                <Markdown>
                  {article.teaser}
                </Markdown>
              </div>
            )}
          </>
        )}
      </InfoCardBody>
    </InfoCard>
  );
}
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { GqlDateTimeScalar } from "../../../common/gql/gql.date-time.scalar";
import { GqlJsonObjectScalar } from "../../../common/gql/gql.json.scalar";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { pretty } from "../../../common/helpers/pretty.helper";
import {
  NpmsPackageInfo_Collected_GitHub_Commit,
  NpmsPackageInfo_Collected_GitHub_Contributor,
  NpmsPackageInfo_Collected_GitHub_Issues_Distribution,
  NpmsPackageInfo_Collected_GitHub_Issues,
  NpmsPackageInfo_Collected_GitHub_Status,
  NpmsPackageInfo_Collected_GitHub,
  NpmsPackageInfo_Collected_Metadata_Links,
  NpmsPackageInfo_Collected_Metadata_Release,
  NpmsPackageInfo_Collected_Metadata_Repository,
  NpmsPackageInfo_Collected_Metadata_User,
  NpmsPackageInfo_Collected_Metadata,
  NpmsPackageInfo_Collected_Npm_Dependencies,
  NpmsPackageInfo_Collected_Npm_Downloads,
  NpmsPackageInfo_Collected_Npm_Source_Files,
  NpmsPackageInfo_Collected_Npm,
  NpmsPackageInfo_Collected_Source,
  NpmsPackageInfo_Collected,
  NpmsPackageInfo_Error,
  NpmsPackageInfo_Evaluation_Maintenance,
  NpmsPackageInfo_Evaluation_Popularity,
  NpmsPackageInfo_Evaluation_Quality,
  NpmsPackageInfo_Evaluation,
  NpmsPackageInfo_Score_Detail,
  NpmsPackageInfo_Score,
  NpmsPackageInfo,
  NpmsPackageInfos,
} from "../api/npms-api.package-info.type";
import { NpmsPackageModel } from "../npms-package.model";


const NpmsPackageInfoCollectedMetadataUserGql = new GraphQLObjectType<NpmsPackageInfo_Collected_Metadata_User >({
  name: 'NpmsPackageInfoCollectedMetadataUser',
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});


export type INpmsPackageGqlDataSource = NpmsPackageModel;
export const NpmsPackageGqlData: GraphQLObjectType<NpmsPackageModel, GqlContext> = new GraphQLObjectType({
  name: 'NpmsPackageData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    raw: { type: new GraphQLNonNull(GraphQLString), resolve: (parent) => JSON.stringify(parent.data ?? null) },
    data: { type: new GraphQLObjectType<NpmsPackageInfo>({ name: 'NpmsPackageDataInfo', fields: () => ({
      analyzedAt: { type: GqlDateTimeScalar },
      collected: { type: new GraphQLObjectType<NpmsPackageInfo_Collected>({ name: 'NpmsPackageDataInfoCollected', fields: () => ({
        metadata: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_Metadata>({ name: 'NpmsPackageDataInfoCollectedMetadata', fields: () => ({
          releases: { type: new GraphQLList(GraphQLNonNull(new GraphQLObjectType<NpmsPackageInfo_Collected_Metadata_Release>({ name: 'NpmsPackageDataInfoCollectedMetadataReleases', fields: () => ({
            from: { type: GqlDateTimeScalar },
            to: { type: GqlDateTimeScalar },
            count: { type: GraphQLInt },
          })})))},
          hasTestScript: { type: GraphQLBoolean },
          hasSelectiveFiles: { type: GraphQLBoolean },
          readme: { type: GraphQLString },
          name: { type: GraphQLString },
          scope: { type: GraphQLString },
          description: { type: GraphQLString },
          keywords: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
          date: { type: GqlDateTimeScalar },
          author: { type: NpmsPackageInfoCollectedMetadataUserGql },
          publisher: { type: NpmsPackageInfoCollectedMetadataUserGql },
          maintainers: { type: GraphQLList(GraphQLNonNull(NpmsPackageInfoCollectedMetadataUserGql)) },
          repository: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_Metadata_Repository>({ name: 'NpmsPackageDataInfoCollectedMetadataRepository', fields: () => ({
            type: { type: GraphQLString, },
            url: { type: GraphQLString, },
          })})},
        })})},
        npm: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_Npm>({ name: 'NpmsPackageDataInfoCollectedNpm', fields: () => ({
          downloads: { type: GraphQLList(GraphQLNonNull(new GraphQLObjectType<NpmsPackageInfo_Collected_Npm_Downloads>({ name: 'NpmsPackageDataInfoCollectedNpmDownloads', fields: () => ({
            from: { type: GqlDateTimeScalar },
            to: { type: GqlDateTimeScalar },
            count: { type: GraphQLInt },
          })})))},
          dependentsCount: { type: GraphQLInt, },
          dependencies: { type: GqlJsonObjectScalar },
          devDependencies: { type: GqlJsonObjectScalar },
          starsCount: { type: GraphQLInt },
        })})},
        github: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_GitHub>({ name: 'NpmsPackageDataInfoCollectedGithub', fields: () => ({
          homepage: { type: GraphQLString, },
          starsCount: { type: GraphQLInt, },
          forksCount: { type: GraphQLInt, },
          subscribersCount: { type: GraphQLInt, },
          issues: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_GitHub_Issues>({ name: 'NpmsPackageDataInfoCollectedGithubIssues', fields: () => ({
            count: { type: GraphQLInt },
            openCount: { type: GraphQLInt },
            distribution: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_GitHub_Issues_Distribution>({ name: 'NpmsPackageDataInfoCollectedGithubIssuesDistribution', fields: () => ({
              _3600: { type: GraphQLInt, resolve: (parent) => parent[3600], },
              _10800: { type: GraphQLInt, resolve: (parent) => parent[10800], },
              _32400: { type: GraphQLInt, resolve: (parent) => parent[32400], },
              _97200: { type: GraphQLInt, resolve: (parent) => parent[97200], },
              _291600: { type: GraphQLInt, resolve: (parent) => parent[291600], },
              _874800: { type: GraphQLInt, resolve: (parent) => parent[874800], },
              _2624400: { type: GraphQLInt, resolve: (parent) => parent[2624400], },
              _7873200: { type: GraphQLInt, resolve: (parent) => parent[7873200], },
              _23619600: { type: GraphQLInt, resolve: (parent) => parent[23619600], },
              _70858800: { type: GraphQLInt, resolve: (parent) => parent[70858800], },
              _212576400: { type: GraphQLInt, resolve: (parent) => parent[212576400], },
            })})},
            isDisabled: { type: GraphQLBoolean },
          })})},
          contributors: { type: GraphQLList(GraphQLNonNull(new GraphQLObjectType<NpmsPackageInfo_Collected_GitHub_Contributor>({ name: 'NpmsPackageDataInfoCollectedGitHubContributor', fields: () => ({
            username: { type: GraphQLString },
            commitsCount: { type: GraphQLString },
          })})))},
          commits: { type: GraphQLList(GraphQLNonNull(new GraphQLObjectType<NpmsPackageInfo_Collected_GitHub_Commit>({ name: 'NpmsPackageDataInfCollectedGitHubCommit', fields: () => ({
            from: { type: GqlDateTimeScalar },
            to: { type: GqlDateTimeScalar },
            count: { type: GraphQLInt },
          })})))},
          statuses: { type: GraphQLList(GraphQLNonNull(new GraphQLObjectType<NpmsPackageInfo_Collected_GitHub_Status>({ name: 'NpmsPackageDataInfoCollectedGitHubStatus', fields: () => ({
            context: { type: GraphQLString },
            state: { type: GraphQLString },
          })})))},
        })})},
        source: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_Source>({ name: 'NpmsPackageDataInfoCollectedSource', fields: () => ({
          files: { type: new GraphQLObjectType<NpmsPackageInfo_Collected_Npm_Source_Files>({ name: 'NpmsPackageDataInfoCollectedNpmSourceFiles', fields: () => ({
            readmeSize: { type: GraphQLInt },
            testsSize: { type: GraphQLInt },
            hasChangeLog: { type: GraphQLBoolean },
          })})},
          linters: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
          coverage: { type: GraphQLFloat },
        })})},
      })})},
      evaluation: { type: new GraphQLObjectType<NpmsPackageInfo_Evaluation>({ name: 'NpmsPackageDataInfoEvaluation', fields: () => ({
        quality: { type: new GraphQLObjectType<NpmsPackageInfo_Evaluation_Quality>({ name: 'NpmsPackageDataInfoEvaluationQuality', fields: () => ({
          carefulness: { type: GraphQLFloat },
          tests: { type: GraphQLFloat },
          health: { type: GraphQLFloat },
          branding: { type: GraphQLFloat },
        })})},
        popularity: { type: new GraphQLObjectType<NpmsPackageInfo_Evaluation_Popularity>({ name: 'NpmsPackageDataInfoEvaluationPopularity', fields: () => ({
          communityInterest: { type: GraphQLFloat },
          downloadsCount: { type: GraphQLFloat },
          downloadsAcceleration: { type: GraphQLFloat },
          dependentsCount: { type: GraphQLFloat },
        })})},
        maintenance: { type: new GraphQLObjectType<NpmsPackageInfo_Evaluation_Maintenance>({ name: 'NpmsPackageDataInfoEvaluationMaintenance', fields: () => ({
          releasesFrequency: { type: GraphQLFloat },
          commitsFrequency: { type: GraphQLFloat },
          openIssues: { type: GraphQLFloat },
          issuesDistribution: { type: GraphQLFloat },
        })})},
      })})},
      score: { type: new GraphQLObjectType<NpmsPackageInfo_Score>({ name: 'NpmsPackageDataInfoScore', fields: () => ({
        final: { type: GraphQLFloat },
        detail: { type: new GraphQLObjectType<NpmsPackageInfo_Score_Detail>({ name: 'NpmsPackageDataInfoScoreDetail', fields: () => ({
          quality: { type: GraphQLFloat },
          popularity: { type: GraphQLFloat },
          maintenance: { type: GraphQLFloat },
        })})},
      })})},
      error: { type: GqlJsonObjectScalar },
    })})},
    last_ran_at: { type: GraphQLNonNull(GqlDateTimeScalar), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});

import { DateString } from "../../types/date-string.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";

export interface NpmsPackageInfo_Collected_Npm_Dependencies {
  [index: string]: string;
}

export interface NpmsPackageInfo_Collected_Npm_Downloads {
  from: OrNullable<DateString>
  to: OrNullable<DateString>
  count: OrNullable<number>;
}

export interface NpmsPackageInfo_Collected_GitHub_Issues_Distribution {
  3600: OrNullable<number>,
  10800: OrNullable<number>,
  32400: OrNullable<number>,
  97200: OrNullable<number>,
  291600: OrNullable<number>,
  874800: OrNullable<number>,
  2624400: OrNullable<number>,
  7873200: OrNullable<number>,
  23619600: OrNullable<number>,
  70858800: OrNullable<number>,
  212576400: OrNullable<number>
}

export interface NpmsPackageInfo_Collected_GitHub_Issues {
  count: OrNullable<number>;
  openCount: OrNullable<number>;
  distribution: OrNullable<NpmsPackageInfo_Collected_GitHub_Issues_Distribution>;
  isDisabled: OrNullable<boolean>;
}

export interface NpmsPackageInfo_Collected_GitHub_Contributor {
  username: OrNullable<string>;
  commitsCount: OrNullable<number>;
}

export interface NpmsPackageInfo_Collected_GitHub_Commit {
  from: OrNullable<DateString>;
  to: OrNullable<DateString>;
  count: OrNullable<number>;
}

export interface NpmsPackageInfo_Collected_GitHub_Status {
  context: OrNullable<string>;
  state: OrNullable<string>;
}

export interface NpmsPackageInfo_Collected_GitHub {
  homepage: OrNullable<string>;
  starsCount: OrNullable<number>;
  forksCount: OrNullable<number>;
  subscribersCount: OrNullable<number>;
  issues: OrNullable<NpmsPackageInfo_Collected_GitHub_Issues>;
  contributors: OrNullable<NpmsPackageInfo_Collected_GitHub_Contributor[]>;
  commits: OrNullable<NpmsPackageInfo_Collected_GitHub_Commit[]>;
  statuses: OrNullable<NpmsPackageInfo_Collected_GitHub_Status[]>;
}

export interface NpmsPackageInfo_Collected_Npm_Source_Files {
  readmeSize: OrNullable<number>;
  testsSize: OrNullable<number>;
  hasChangeLog: OrNullable<boolean>;
}

export interface NpmsPackageInfo_Collected_Source {
  files: OrNullable<NpmsPackageInfo_Collected_Npm_Source_Files>;
  linters: OrNullable<string[]>;
  coverage: OrNullable<number>;
}

export interface NpmsPackageInfo_Collected_Npm {
  downloads: OrNullable<NpmsPackageInfo_Collected_Npm_Downloads[]>;
  dependentsCount: OrNullable<number>;
  dependencies: OrNullable<NpmsPackageInfo_Collected_Npm_Dependencies>;
  devDependencies: OrNullable<NpmsPackageInfo_Collected_Npm_Dependencies>;
  starsCount: OrNullable<number>;
}


export interface NpmsPackageInfo_Collected_Metadata_User {
  name: OrNullable<string>;
  email: OrNullable<string>;
}

export interface NpmsPackageInfo_Collected_Metadata_Repository {
  type: OrNullable<string>;
  url: OrNullable<string>;
}

export interface NpmsPackageInfo_Collected_Metadata_Release {
  from: OrNullable<DateString>
  to: OrNullable<DateString>
  count: number;
}

export interface NpmsPackageInfo_Collected_Metadata_Links {
  npm: OrNullable<string>;
  homepage: OrNullable<string>;
  repository: OrNullable<string>;
  bugs: OrNullable<string>;
}

export interface NpmsPackageInfo_Collected_Metadata {
  releases: OrNullable<NpmsPackageInfo_Collected_Metadata_Release[]>;
  hasTestScript: OrNullable<boolean>;
  hasSelectiveFiles: OrNullable<boolean>;
  readme: OrNullable<string>;

  name: OrNullable<string>;
  scope: OrNullable<string>;
  description: OrNullable<string>;
  keywords: OrNullable<string[]>;
  date: OrNullable<DateString>;
  author: OrNullable<NpmsPackageInfo_Collected_Metadata_User>;
  publisher: OrNullable<NpmsPackageInfo_Collected_Metadata_User>;
  maintainers: OrNullable<NpmsPackageInfo_Collected_Metadata_User[]>;
  repository: OrNullable<NpmsPackageInfo_Collected_Metadata_Repository>;
}

export interface NpmsPackageInfo_Collected {
  metadata: OrNullable<NpmsPackageInfo_Collected_Metadata>;
  npm: OrNullable<NpmsPackageInfo_Collected_Npm>;
  github: OrNullable<NpmsPackageInfo_Collected_GitHub>;
  source: OrNullable<NpmsPackageInfo_Collected_Source>;
};

export interface NpmsPackageInfo_Evaluation_Quality {
  carefulness: OrNullable<number>;
  tests: OrNullable<number>;
  health: OrNullable<number>;
  branding: OrNullable<number>;
}

export interface NpmsPackageInfo_Evaluation_Popularity {
  communityInterest: OrNullable<number>;
  downloadsCount: OrNullable<number>;
  downloadsAcceleration: OrNullable<number>;
  dependentsCount: OrNullable<number>;
}

export interface NpmsPackageInfo_Evaluation_Maintenance {
  releaseFrequency: OrNullable<number>;
  commitsFrequency: OrNullable<number>;
  openIssues: OrNullable<number>;
  issuesDistribution: OrNullable<number>;
}

export interface NpmsPackageInfo_Evaluation {
  quality: OrNullable<NpmsPackageInfo_Evaluation_Quality>;
  popularity: OrNullable<NpmsPackageInfo_Evaluation_Popularity>;
  maintenance: OrNullable<NpmsPackageInfo_Evaluation_Maintenance>;
}

export interface NpmsPackageInfo_Score_Detail {
  quality: OrNullable<number>;
  popularity: OrNullable<number>;
  maintenance: OrNullable<number>;
}

export interface NpmsPackageInfo_Score {
  final: OrNullable<number>;
  detail: OrNullable<NpmsPackageInfo_Score_Detail>;
}


export interface NpmsPackageInfo_Error {
  //
}

export interface NpmsPackageInfo {
  analyzedAt: OrNullable<DateString>;
  collected: OrNullable<NpmsPackageInfo_Collected>;
  evaluation: OrNullable<NpmsPackageInfo_Evaluation>;
  score: OrNullable<NpmsPackageInfo_Score>;
  error: OrNullable<NpmsPackageInfo_Error>;
}

export type NpmsPackageInfos<T extends string  = string> = Record<T, OrNullable<NpmsPackageInfo>>;
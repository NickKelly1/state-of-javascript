import { useMemo } from "react";
import { IPieChartDatum } from "../components/package-popularity-pie-chart/fitted-pie-chart";
import { NpmsPackageInfo, NpmsPackageInfos } from "../npms-api/types/npms-package-info.type";
import { OrNullable } from "../types/or-nullable.type";

export function makePackageChartData<T>(
  packages: NpmsPackageInfos,
  valueFn: (arg: { pkg: NpmsPackageInfo, name: string }) => OrNullable<number>,
): IPieChartDatum[] {
  const result: IPieChartDatum[] = useMemo(() => {
    const entries = Object.entries(packages);
    const data: IPieChartDatum[] = [];
    entries.forEach(([name, pkg]) => {
      if (!pkg) {
        console.warn(`Cannot show package "${name}"`);
        return;
      }
      const value = valueFn({ name, pkg });
      if (value != undefined) {
        data.push({ name, value });
      } else {
        console.warn(`Cannot show package "${name}"`);
      }
    });
    return data;
  }, [packages]);
  return result;
}
import { useMemo } from "react";
import { NpmsPackageInfo, NpmsPackageInfos } from "../npms-api/types/npms-package-info.type";
import { PieChartDatum } from "../types/pie-chart-datum.type";
import { OrNullable } from "../types/or-nullable.type";

export function makePackageChartData<T>(
  packages: NpmsPackageInfos,
  valueFn: (arg: { pkg: NpmsPackageInfo, name: string }) => OrNullable<number>,
): PieChartDatum[] {
  const result: PieChartDatum[] = useMemo(() => {
    const entries = Object.entries(packages);
    const data: PieChartDatum[] = [];
    entries.forEach(([name, pkg]) => {
      if (!pkg) {
        console.warn(`Cannot show package "${name}"`);
        data.push({ name, value: 0 });
        return;
      }
      const value = valueFn({ name, pkg });
      if (value != undefined) {
        data.push({ name, value });
        return;
      } else {
        console.warn(`Cannot show package "${name}"`);
        data.push({ name, value: 0 });
        return;
      }
    });
    return data;
  }, [packages]);
  return result;
}
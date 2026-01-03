export type MetricType = 'sales' | 'buyers' | 'revenue';

export interface ChartConfig {
  title: string;
  color: string;
  dataKey: string;
  formatter?: (value: number) => string;
}

"use client";

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartRendererProps {
  configString: string;
}

interface AIChartConfig {
  type: 'line' | 'bar';
  title: string;
  data: Array<Record<string, string | number>>;
  xAxisKey: string;
  series: Array<{
    key: string;
    name: string;
    color: string;
  }>;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ configString }) => {
  const chartConfig = useMemo<AIChartConfig | null>(() => {
    try {
      const cleanJson = configString
        .replace(/^```json:chart\s*/, '')
        .replace(/```$/, '')
        .trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Error:", e);
      return null;
    }
  }, [configString]);

  if (!chartConfig) return null;

  const { type, title, data, xAxisKey, series } = chartConfig;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border shadow-xl rounded-xl text-sm backdrop-blur-sm">
          <p className="font-semibold mb-2 text-foreground">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="flex items-center gap-2 text-foreground">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
              <span className="text-muted-foreground">{p.name}:</span>
              <span className="font-semibold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full my-6 bg-linear-to-br from-muted/30 to-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header Chart */}
      <div className="mb-6 pb-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-full"></div>
          {title}
        </h3>
      </div>

      {/* Area Chart */}
      <div className="h-80 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={40}
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px' }}
              />
              {series.map((s, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color || "hsl(var(--primary))"}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  fill={`url(#gradient-${i})`}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={40}
                wrapperStyle={{ paddingBottom: '10px' }}
              />
              {series.map((s, i) => (
                <Bar
                  key={i}
                  dataKey={s.key}
                  name={s.name}
                  fill={s.color || "hsl(var(--primary))"}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {data.length} titik data • Diperbarui secara real-time
        </p>
      </div>
    </div>
  );
};

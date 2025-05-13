
import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface HistogramChartProps {
  data: number[];
  binWidth: number;
  color: string;
  title: string;
  compact?: boolean;
}

const HistogramChart: React.FC<HistogramChartProps> = ({ data, binWidth, color, title, compact = false }) => {
  // Create histogram bins from the data
  const histogramData = useMemo(() => {
    if (!data.length) return [];

    // Find min and max for bin range
    const min = Math.floor(Math.min(...data));
    const max = Math.ceil(Math.max(...data));

    // Create bins
    const bins: { range: string; count: number; binStart: number }[] = [];
    for (let binStart = min; binStart < max + binWidth; binStart += binWidth) {
      const binEnd = binStart + binWidth;
      const count = data.filter(d => d >= binStart && d < binEnd).length;
      bins.push({
        range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        count,
        binStart
      });
    }

    return bins;
  }, [data, binWidth]);

  // Calculate statistics
  const mean = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }, [data]);

  const stdDev = useMemo(() => {
    if (!data.length) return 0;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }, [data, mean]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium">{title}</h4>
        {data.length > 0 && !compact && (
          <div className="text-xs text-muted-foreground">
            μ = {mean.toFixed(2)}m, σ = {stdDev.toFixed(2)}
          </div>
        )}
      </div>
      {data.length > 0 ? (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={histogramData}
              margin={{
                top: 5,
                right: 5,
                bottom: 20,
                left: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="binStart" 
                tickFormatter={(value) => value.toFixed(1)}
                label={{ value: 'Distance (m)', position: 'insideBottom', offset: -15 }}
                fontSize={10}
                minTickGap={15}
              />
              <YAxis 
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                fontSize={10}
                width={25}
              />
              {!compact && <Tooltip 
                formatter={(value) => [`Count: ${value}`, 'Frequency']}
                labelFormatter={(label) => `Distance: ${Number(label).toFixed(1)}m`}
              />}
              <Bar dataKey="count" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20 rounded">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      )}
      {data.length > 0 && compact && (
        <div className="text-xs text-center text-muted-foreground mt-1">
          n = {data.length}, μ = {mean.toFixed(2)}m
        </div>
      )}
    </div>
  );
};

export default HistogramChart;

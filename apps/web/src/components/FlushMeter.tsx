'use client';

import { StatBox } from '@dshit/ui';

interface Metric {
  label: string;
  value: number;
  accentColor: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
}

export const FlushMeter = () => {
  const metrics: Metric[] = [
    { label: 'Bowl Pressure', value: 78, accentColor: 'yellow' },
    { label: 'Flush Velocity', value: 62, accentColor: 'orange' },
    { label: 'Stench Index', value: 91, accentColor: 'red' },
    { label: 'Wipe Coverage', value: 4, accentColor: 'green' },
    { label: 'Corn Ratio', value: 55, accentColor: 'brown' },
    { label: 'Clog Risk', value: 84, accentColor: 'purple' },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-display text-shit-yellow mb-8 font-bold">
        FLUSH METER
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="relative">
            <StatBox
              number={`${metric.value}%`}
              label={metric.label}
              accentColor={metric.accentColor}
            />
            {/* Progress bar */}
            <div className="mt-3 w-full bg-gray-700 rounded h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300`}
                style={{
                  width: `${metric.value}%`,
                  backgroundColor:
                    metric.accentColor === 'yellow'
                      ? '#F4D03F'
                      : metric.accentColor === 'red'
                        ? '#FF0000'
                        : metric.accentColor === 'green'
                          ? '#39FF14'
                          : metric.accentColor === 'orange'
                            ? '#FF6600'
                            : metric.accentColor === 'brown'
                              ? '#8B4513'
                              : '#BF00FF',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

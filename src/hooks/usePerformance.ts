import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
}

export const usePerformance = (componentName: string) => {
  const startTime = useRef(performance.now());
  const renderStartTime = useRef(performance.now());

  useEffect(() => {
    const loadTime = performance.now() - startTime.current;

    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime: performance.now() - renderStartTime.current,
    };

    // 在开发环境下输出性能指标
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance metrics for ${componentName}:`, metrics);
    }

    // 可以在这里添加性能数据上报逻辑
    // reportPerformanceMetrics(componentName, metrics);
  }, []);

  return {
    startRender: () => {
      renderStartTime.current = performance.now();
    },
  };
}; 
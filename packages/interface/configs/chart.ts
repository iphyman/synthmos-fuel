import { ChartOptions, ColorType, DeepPartial } from 'lightweight-charts';

export const CHART_CONFIG: DeepPartial<ChartOptions> = {
  layout: {
    background: { type: ColorType.Solid, color: 'transparent' },
    textColor: 'rgba(255, 255, 255, 0.48)',
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.2,
    },
    borderVisible: false,
  },
  grid: {
    horzLines: {
      color: '#3c4253',
      style: 1,
    },
    vertLines: {
      color: '#3c4253',
      style: 1,
    },
  },
  timeScale: {
    borderVisible: false,
    timeVisible: true,
    ticksVisible: false,
    secondsVisible: true,
    rightOffset: 20,
  },
  crosshair: {
    horzLine: {
      labelBackgroundColor: '#3C414C',
    },
    vertLine: {
      labelBackgroundColor: '#3C414C',
    },
  },
  autoSize: true,
};

import moment from 'moment';
import { convertCountUnit } from '@/utils/numberFormat';

moment.locale('ko');

// 코로나 현황 파이차트
export const pieOptions = {
  chart: {
    type: 'pie',
    backgroundColor: 'transparent',
    height: '300px',
  },
  time: {
    useUTC: false,
  },
  title: true,
  credits: false,
  tooltip: {
    split: false,
    shared: true,
    valueDecimals: 2,
    formatter () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.key}: ${convertCountUnit(this.y)} 명`;
    },
  },
  plotOptions: {
    pie: {
      size: '200px',
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: false,
      },
      showInLegend: true,
      innerSize: '60%',
    },
  },
  legend: {
    align: 'center',
    verticalAlign: 'top',
  },
  series: [],
};

// 코로나 현황 멀티 라인차트
export const lineOptions = {
  time: {
    useUTC: false,
  },
  chart: {
    type: 'line',
    backgroundColor: 'transparent',
    spacingTop: 5,
    spacingBottom: 5,
  },
  title: {
    text: '',
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'datetime',
    // tickLength: 6,
    labels: {
      formatter () {
        return moment(this.value).format('YYYY-MM-DD');
      },
    },
    crosshair: true,
  },
  yAxis: {
    title: false,
    max: null,
    minTickInterval: 1,
    startOnTick: false,
    lineWidth: 2,
    labels: {
      formatter () {
        // 숫자 단위의 경우 쉼표 자릿수 표현
        return convertCountUnit(this.value);
      },
    },
  },
  plotOptions: {
    series: {
      animation: false,
      lineWidth: 1,
      marker: {
        radius: 2,
      },
    },
  },
  legend: {
    enabled: true,
  },
  tooltip: {
    split: false,
    shared: true,
    formatter () {
      const target = this.points;
      let tooltip = [];
      target.forEach((point) => {
        tooltip += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${convertCountUnit(point.y)}</b><br/>`;
      });
      return tooltip;
    },
  },
  series: [],
};

// 코로나 현황 스택 컬럼 차트
export const stackedColumnOptions = {
  chart: {
    type: 'column',
    backgroundColor: 'transparent',
  },
  title: {
    text: '',
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'datetime',
    labels: {
      formatter () {
        return moment(this.value).format('YYYY-MM-DD');
      },
    },
  },
  yAxis: {
    title: false,
    min: 0,
    lineWidth: 1,
    labels: {
      formatter () {
        // 숫자 단위의 경우 쉼표 자릿수 표현
        return convertCountUnit(this.value);
      },
    },
  },
  time: {
    useUTC: false,
  },
  tooltip: {
    formatter () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: ${convertCountUnit(this.y)}`;
    },
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
        formatter () {
          // 숫자 단위의 경우 쉼표 자릿수 표현
          return convertCountUnit(this.y);
        },
      }
    },
  },
  series: [],
  legend: {
    enabled: true,
  },
};

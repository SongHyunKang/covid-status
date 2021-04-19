<template>
  <el-row style="height: 100%;" type="flex" justify="center" align="middle">
    <highcharts v-if="isShow" style="width: 100%; height: 100%;" :options="options"/>
  </el-row>
</template>

<script>
import { pieOptions, lineOptions, stackedColumnOptions } from '@/constants/chart-options';
import { CHART_TYPE } from '@/constants/chart-types';
import moment from 'moment';

export default {
  name: 'CovidStatusChart',
  props: {
    chartOptions: {
      type: Object,
      default: () => {},
    },

  },
  data () {
    return {
      options: {},
      isShow: false,
    };
  },
  methods: {
    // 전달 받은 파라미터에 따라 차트 옵션 세팅할 수 있도록 분기
    setChartOptions (data, type) {
      this.isShow = false;
      this.$nextTick(() => {
        if (type === CHART_TYPE.PIE) {
          this.setPieChartSetting(data);
        } else if (type === CHART_TYPE.LINE) {
          this.setMultiLineChartSetting(data);
        } else if (type === CHART_TYPE.STACKED) {
          this.setStackedChartSetting(data);
        }
      });
    },
    // 코로나 현황 파이 차트 옵션 및 데이터 세팅
    setPieChartSetting (data) {
      const pieChartData = [];
      pieChartData.push({ y: Number(data.decideCnt), name: '확진자 수' });
      pieChartData.push({ y: Number(data.deathCnt), name: '사망자 수' });
      this.options = Object.assign({}, pieOptions);
      this.options.series = [{ name: '대상 수', colorByPoint: true, data: pieChartData }];
      this.options.title = {
        text: `${data.stateDtTimeLabel}`,
        align: 'center',
        verticalAlign: 'middle',
        y: 30,
        style: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      };
      // 차트 draw
      this.isShow = true;
    },
    // 코로나 현황 멀티 라인 차트 옵션 및 데이터 가공, 세팅
    setMultiLineChartSetting (data) {
      this.isShow = false;
      this.$nextTick(() => {
        this.options = Object.assign({}, lineOptions);
        const decideCntDataList = [];
        const exameCntDataList = [];
        data.forEach((item) => {
          decideCntDataList.push([item.stateDtTime, Number(item.decideCnt)]);
          exameCntDataList.push([item.stateDtTime, Number(item.examCnt)]);
        });
        this.options.series = [
          {
            name: '확진자 수',
            data: decideCntDataList,
            lineWidth: 1,
          },
          {
            name: '검사 진행 수',
            data: exameCntDataList,
            lineWidth: 1,
          },
        ];
      });
      this.isShow = true;
    },
    // 코로나 현황 스택 막대 차트 옵션 및 데이터 가공, 세팅
    setStackedChartSetting (data) {
      this.isShow = false;
      this.$nextTick(() => {
        this.options = Object.assign({}, stackedColumnOptions);
        const deathCntDataList = [];
        const clearCntDataList = [];
        const careCntDataList = [];
        const categoriesList = [];
        data.forEach((item) => {
          deathCntDataList.push(Number(item.deathCnt));
          clearCntDataList.push(Number(item.clearCnt));
          careCntDataList.push(Number(item.careCnt));
          categoriesList.push(moment(item.stateDtTime).format('YYYY-MM-DD')); // x축 카테고리 라벨
        });
        this.options.series = [
          {
            name: '치료중인 환자 수',
            data: careCntDataList,
          },
          {
            name: '격리해제 수',
            data: clearCntDataList,
          },
          {
            name: '사망자 수',
            data: deathCntDataList,
          },
        ];
        this.options.xAxis.categories = categoriesList;
        this.isShow = true;
      });
    },
  },
};
</script>

<template>
  <div>
    <el-table
      :data="covidStatusDataList"
      style="width: 100%; height: 100%;"
      border
      height="100%"
      minHeight="100%"
      fit
    >
      <el-table-column prop="stateDtTime" align="center" label="일자">
        <template slot-scope="scope">
          {{ convertDatetime(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="decideCnt" sortable align="center" label="확진자 수" :formatter="convertCountUnitValue"/>
      <el-table-column prop="deathCnt" sortable align="center" label="사망자 수" :formatter="convertCountUnitValue"/>
      <el-table-column align="center" label="상세정보">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onClickCovidStatusPieChart(scope.row)">통계보기</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment';
import { convertCountUnit } from '@/utils/numberFormat';

export default {
  name: 'CovidStatusTable',
  props: {
    covidStatusDataList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    // moment를 사용하여 요일 정보를 구하고, 한글로 변환
    convertDatetime (row) {
      const dayName = moment(row.stateDtTime).day();
      let targetName = '';
      switch (dayName) {
        case 0:
          targetName = '(월)';
          break;
        case 1:
          targetName = '(화)';
          break;
        case 2:
          targetName = '(수)';
          break;
        case 3:
          targetName = '(목)';
          break;
        case 4:
          targetName = '(금)';
          break;
        case 5:
          targetName = '(토)';
          break;
        case 6:
          targetName = '(일)';
          break;
      }
      row.stateDtTimeLabel = `${moment(row.stateDtTime).format('YY/MM/DD')} ${targetName}`;
      return row.stateDtTimeLabel;
    },
    // 테이블 - 통계보기 클릭 시 상위 컴포넌트에 데이터 전달하여 파이차트를 그리도록 한다.
    onClickCovidStatusPieChart (data) {
      this.$emit('load-covid-pie-chart', data, 'pie');
    },
    // 컬럼 값 단위 변환
    convertCountUnitValue (row, column) {
      return convertCountUnit(row[column.property]);
    }
  },
}
</script>

<template>
  <div>
    <div>
      <el-row type="flex" justify="space-between" align="middle">
        <div>
          <el-select
            style="margin-left: 4px; width: 130px;"
            size="mini"
            v-model="dateSelect" @change="onChangeDateSelect">
              <el-option
                v-for="item in dateOptions"
                :label="item.label"
                :key="item.value"
                :value="item.value"
                />
          </el-select>
        </div>
        <div>
          <span style="font-size: 13px;">{{ timerCnt }} 초 후 갱신
          <i class="el-icon-refresh refresh-icon" @click="reload" />
          </span>
        </div>
      </el-row>
      <hr />
    </div>
    <!-- 코로나 현황 테이블 및 파이 차트 영역 -->
    <div style="height: 350px;">
      <el-row class="title-font">코로나 현황 테이블</el-row>
      <el-row type="flex" :gutter="20" style="height: calc(100% - 20px);">
        <el-col :span="16" style="height: 100%;">
          <covid-status-table
            style="height: 100%;"
            ref="covidStatusTableRef"
            :covid-status-data-list="covidStatusDataList"
            @load-covid-pie-chart="loadCovidPieChart"
          />
        </el-col>
        <el-col :span="8">
          <covid-status-chart ref="covidStatusPieChart" />
        </el-col>
      </el-row>
    </div>
    <!-- 추가적인 차트 -->
    <div style="height: 300px; margin-top: 40px;">
      <el-row :gutter="30" style="height: 100%;">
        <el-col :lg="12" :md="24" style="height: 100%;">
          <!-- 멀티차트 -->
          <el-row class="title-font">코로나 현황 차트 [ 확진자 / 검사 진행 수 ]</el-row>
          <covid-status-chart style="height: 100%;" ref="covidStatusMultiLineChart" />
        </el-col>
        <el-col :lg="12" :md="24" style="height: 100%;">
          <!-- 스택 차트 -->
          <el-row class="title-font">코로나 현황 차트 [ 격리해제 수 / 사망자 수 ]</el-row>
          <covid-status-chart style="height: 100%;" ref="covidStatusStackedChart" />
        </el-col>
      </el-row>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { CHART_TYPE } from '@/constants/chart-types';
import CovidStatusTable from './components/CovidStatusTable';
import CovidStatusChart from './components/CovidStatusChart';

moment.locale('ko');

export default {
  name: 'MainView',
  components: {
    CovidStatusTable,
    CovidStatusChart,
  },
  data () {
    return {
      datetimeRange: {},
      timerCnt: 5,
      covidStatusDataList: [],
      chartOptions: [],
      lastClickedKey: null,
      timerInfo: null, // 타이머 객체
      dateSelect: 7,
      dateOptions: [
        {
          label: '최근 7일전',
          value: 7,
        },
        {
          label: '최근 14일전',
          value: 14,
        },
      ],
      chartRefs: [
        {
          ref: 'covidStatusMultiLineChart',
          type: CHART_TYPE.LINE,
        },
        {
          ref: 'covidStatusStackedChart',
          type: CHART_TYPE.STACKED,
        },
      ]
    };
  },
  // 화면이 그려진 뒤 공공 API 조회 및 타이머 수행
  mounted () {
    this.loadData();
    this.setTimer();
  },
  methods: {
    // API 조회 및 가공 수행
    loadData () {
      // 날짜 세팅
      this.setSelectTime();
      const params = {
        serviceKey: 'AtRnBtL84W1xXR87doZlzk5vn2nIN7F1kj3MYZRfWe54jmWygzbMUYWCvLdiJZIrokEgmSDW7S%2F%2BFSrSjS1Waw%3D%3D',
        startCreateDt: this.datetimeRange.startCreateDt,
        endCreateDt: this.datetimeRange.endCreateDt,
        pageNo: 1,
        numOfRows: 10,
      }
      axios.get('/api/getList', {
        params,
      }).then((res) => {
        // 공공 API response 결과가 XML 형식으로 오므로, Json형태로 변환 수행
        this.covidStatusDataList = this.convertXmlToJson(res.data.body);
        if (this.covidStatusDataList.length) {
          this.covidStatusDataList.forEach((item) => {
            item.stateDtTime = moment(item.stateDt, 'YYYYMMDD').valueOf();
          });
          // 시간 순 정렬
          this.covidStatusDataList.sort((a, b) => a.stateDtTime - b.stateDtTime);
          // 데이터 세팅 후 멀티 라인 차트 및 스택 차트를 로드한다.
          this.setChartComponents();
        }
      }).catch((e) => {
        // console.log('error', e)
      });
    },
    // xml 형식의 데이터를 파싱하여, 찾고자하는 코로나 현황 값에 접근한다.
    convertXmlToJson (txt) {
      const parse = new DOMParser();
      const xml = parse.parseFromString(txt, 'text/xml');
      const items = [...xml.getElementsByTagName('item')];
      return items.map(item => this.getCovidData(item));
    },
    // 최하위 children까지 값을 접근하여, key와 value를 구분하여 제이슨 형식으로 구성 및 배열로 반환한다.
    getCovidData (item) {
      const data = [...item.children];
      return data.reduce((acc, v) => {
        acc[v.tagName] = v.innerHTML;
        return acc;
      }, {});
    },
    // 테이블 - 통계보기 클릭을 통해 전달 받은 emit 이벤트이며 파이차트를 로드한다.
    loadCovidPieChart (data, type) {
      this.lastClickedKey = data.stateDt;
      this.$refs.covidStatusPieChart.setChartOptions(data, type);
    },
    // 전체 새로고침 시 마지막으로 선택했던 파이차트를 다시 그린다.
    reloadComp () {
      const filterData = this.covidStatusDataList.filter((item) => this.lastClickedKey === item.stateDt);
      if (!filterData.length || !this.$refs.covidStatusPieChart) return;
      this.$refs.covidStatusPieChart.setChartOptions(filterData[0], 'pie');
    },
    // 타이머 세팅
    setTimer () {
      if (this.timerInfo) clearInterval(this.timerInfo);
      this.$nextTick(() => {
        const timer = setInterval(() => {
          if (this.timerCnt === 0) {
            this.reload();
            this.timerCnt = 5;
          } else {
            this.timerCnt--;
          }
        }, 1000);
        this.timerInfo = timer;
      });
    },
    // chartRefs에 정의된 차트들을 전부 로드한다.
    setChartComponents () {
      this.chartRefs.forEach((item) => {
        this.$refs[item.ref].setChartOptions(this.covidStatusDataList, item.type);
      });
    },
    // 좌측 상단 날짜 선택박스 값을 토대로 API 조회 파라미터에 시간을 세팅한다.
    setSelectTime () {
      this.datetimeRange = {
        startCreateDt: moment(new Date()).subtract(this.dateSelect, 'd').format('YYYYMMDD'),
        endCreateDt: moment(new Date()).format('YYYYMMDD'),
      };
    },
    // 좌측 상단 날짜 선택박스 체인지 함수
    onChangeDateSelect () {
      this.$nextTick(() => {
        this.loadData();
      });
    },
    // 전체 리로드 함수
    reload () {
      this.loadData();
      this.reloadComp();
    },
  },
};
</script>

<style scoped>
  .title-font {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .refresh-icon {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
</style>

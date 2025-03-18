import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export const logsStore = defineStore('logs', () => {
  const records = ref([]);
  const isLoaded = ref(false);
  const lastUpdate = ref(new Date())
  const toast = useToast();

  function getCurrentHour() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
  }

  function getNextHour() {
    const dt = getCurrentHour();
    return new Date(dt.getTime() + 60 * 60 * 1000);
  }

  function getPrevHour() {
    const dt = getCurrentHour();
    return new Date(dt.getTime() - 60 * 60 * 1000);
  }

  const getSources = computed(()=>{
    return records.value.reduce((sources,item) => {
      if (!sources.includes(item.source)) {
        sources.push(item.source)
      }
      return sources
    },[])
  })

  const getOkCount = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => i.stage2 && i.stage2 >= getCurrentHour() && i.stage2 < getNextHour()).length;
  });

  const getOkCountPrev = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => i.stage2 && i.stage2 >= getPrevHour() && i.stage2 < getCurrentHour()).length;
  });

  const getWarnCount = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => (!i.stage1 || (i.stage1 >= getCurrentHour() && i.stage1 < getNextHour())) && i.warns.length > 0)
    .reduce((sum, j) => sum + j.warns.filter((w) => w.time >= getCurrentHour() && w.time < getNextHour()).length, 0);
  });

  const getWarnCountPrev = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => (!i.stage1 || (i.stage1 >= getPrevHour() && i.stage1 < getCurrentHour())) && i.warns.length > 0)
    .reduce((sum, j) => sum + j.warns.filter((w) => w.time >= getPrevHour() && w.time < getCurrentHour()).length, 0);
  });

  const getErrorCount = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => (!i.stage1 || (i.stage1 >= getCurrentHour() && i.stage1 < getNextHour())) && i.errors.length > 0)
      .reduce((sum, j) => sum + j.errors.filter((e) => e.time >= getCurrentHour() && e.time < getNextHour()).length, 0);
  });

  const getErrorCountPrev = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => (!i.stage1 || (i.stage1 >= getPrevHour() && i.stage1 < getCurrentHour())) && i.errors.length > 0)
      .reduce((sum, j) => sum + j.errors.filter((e) => e.time >= getPrevHour() && e.time < getCurrentHour()).length, 0);
  });

  const getInProccessCount = computed(() => {
    if (!isLoaded.value) {
      return 0;
    }
    return records.value.filter((i) => !i.stage2 && i.errors.length === 0).length;
  });

  const getFiles = computed(() => {
    if (!isLoaded.value) {
      return [];
    }
    const slice = records.value.filter((i) => i.stage2).slice(-20);
    const ret = slice.reduce((arr, i) => {
      arr.push({
        source: i.source,
        filename: i.filename,
        dt: i.stage2,
        isNew: i.stage2 > new Date() - 60 * 1000,
        warns: i.warns.length
      });
      return arr;
    }, []);
    return ret.sort((a, b) => a.dt < b.dt);
  });

  const getErrorsStat = computed(() => {
    let retObj = {
      labels: [],
      valuesWarn: [],
      valuesError: []
    };

    if (!isLoaded.value) {
      return retObj;
    }
    let sources = Array.from(
      records.value.reduce((s, i) => {
        s.add(i.source);
        return s;
      }, new Set())
    ).sort((a, b) => a > b);
    for (let source of sources) {
      const errCnt = records.value.filter((i) => i.source === source).reduce((sum, j) => sum + j.errors.length, 0);
      const warnCnt = records.value.filter((i) => i.source === source).reduce((sum, j) => sum + j.warns.length, 0);
      retObj.labels.push(source);
      retObj.valuesError.push(errCnt);
      retObj.valuesWarn.push(warnCnt);
    }
    return retObj;
  });

  let checkIsLoaded = setInterval(function () {
    if (new Date() - lastUpdate.value > 2 * 1000 || isLoaded.value) {
      isLoaded.value = true
      clearInterval(checkIsLoaded);
    }
  }, 1 * 1000);

  const addText = (data) => {
    lastUpdate.value = new Date()

    if (!isLoaded.value && new Date(data.time) >= new Date() - 60 * 1000) {
      isLoaded.value = true;
    }

    if (!data.filename) return

    let idx = records.value.findIndex((x) => x.filename === data.filename);
    if (idx === -1) {
      records.value.push({
        source: data.source,
        filename: data.filename,
        stage1: null,
        stage2: null,
        errors: [],
        warns: []
      });
    }

    let item = records.value.find((x) => x.filename === data.filename);

    if (data.level === 'ERROR') {
      item.errors.push({ time: new Date(data.time), message: data.msg });
      if (new Date(data.time) >= new Date() - 10 * 1000) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка обработки файла',
          detail: data.filename + ' : ' + data.msg,
          life: 600000,
          group: 'br'
        });
      }
    }

    if (data.level === 'WARN') {
      item.warns.push({ time: new Date(data.time), message: data.msg });
      if (new Date(data.time) >= new Date() - 10 * 1000) {
        toast.add({
          severity: 'warn',
          summary: 'Проблемы в файле',
          detail: data.filename + ' : ' + data.msg,
          life: 5000,
          group: 'br'
        });
      }
    }
    if (data.stage === 1 && data.msg === 'file downloaded') {
      item.stage1 = new Date(data.time);
    }
    if (data.stage === 2 && data.msg === 'file parsed') {
      item.stage2 = new Date(data.time);
      if (item.stage2 >= new Date() - 10 * 1000) {
        toast.add({
          severity: 'success',
          summary: 'Успешно обработан файл',
          detail: data.filename,
          life: 5000,
          group: 'br'
        });
      }
    }
  };

  const getLogsBySource =  (source) => {
    if (!isLoaded.value) {
      return [];
    }
    return records.value.filter((i) => i.source === source).reverse()
  }

  const removeOld = () => {
    records.value = records.value.filter((i) => i.stage1 >= getPrevHour())
  };

  const clear = () => {
    records.value = [];
    isLoaded.value = false;
  };


  return {
    records,
    getOkCount,
    getOkCountPrev,
    getWarnCount,
    getWarnCountPrev,
    getErrorCount,
    getErrorCountPrev,
    getInProccessCount,
    getFiles,
    getErrorsStat,
    getSources,
    getLogsBySource,
    isLoaded,
    clear,
    removeOld,
    addText
  };
});

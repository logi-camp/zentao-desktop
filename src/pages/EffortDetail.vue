<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import useRepo from '../store/useRepo';
import { useObservable } from '@vueuse/rxjs';
import 'ant-design-vue/lib/time-picker/style/index.css';
import dayjs, { Dayjs } from 'dayjs';
import { fuzzy_time } from '../utils';
import { State } from '../store/types';

document.title = 'Effort Detail';
const submit = () => {
  const payload: Partial<State['persistedStates']['workingTask']> = {
    left: state.left,
    work: state.work,
    consumed: consumed.value || undefined,
  };
  useRepo().submitEffort(payload);
};

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const consumedAuto = useObservable(useRepo().effortDurationSeconds$);

// Consumed time in seconds
const consumed = computed(() => {
  if (state.inputType === 'no') {
    return consumedAuto.value;
  } else if (state.inputType === 'duration') {
    if (!state.inputDuration) return 0;
    let startOfDay = new Date();
    startOfDay.setHours(0, 0);
    return ((state.inputDuration.toDate().getTime() || 0) - startOfDay.getTime() + 60000) / 1000;
  } else if (state.inputType === 'end-time') {
    if (!state.endTime) return 0;
    let endDate = state.endTime.toDate();
    let result =
      ((endDate.getTime() || 0) - (useObservable(useRepo().workingTask$).value?.started?.getTime() || 0)) / 1000;
    if (result <= 0) {
      return (
        (addDays(endDate, +1).getTime() - (useObservable(useRepo().workingTask$).value?.started?.getTime() || 0)) / 1000
      );
    } else if (result > 3600 * 24) {
      return (
        ((addDays(endDate, -1).getTime() || 0) -
          (useObservable(useRepo().workingTask$).value?.started?.getTime() || 0)) /
        1000
      );
    } else {
      return result;
    }
  }
});

const consumedInHours = computed(() => Number.parseFloat((((consumed.value || 0) * 1) / 3600).toFixed(3)));

const start = computed(() => dayjs(useObservable(useRepo().workingTask$).value?.started));
const end = computed(() => {
  if (!consumed.value) {
    return undefined;
  }
  return start.value.clone().add(consumed.value || 0, 'seconds');
});

const effortDuration = useObservable(useRepo().effortDuration$);

const state = reactive<{
  work?: string;
  left?: number;
  endTime: Dayjs;
  inputDuration?: Dayjs;
  inputType: 'duration' | 'end-time' | 'no';
}>({ inputType: 'no', endTime: dayjs() });
</script>
<template>
  <div display="flex" flex="col" gap="3" m="6">
    <div display="flex">
      <span>task:</span>
      <div flex="1">{{ useObservable(useRepo().selectedTask$).value?.name }}</div>
    </div>
    <div display="flex">
      <span>range:</span>
      <div display="flex" gap="3">
        <div>{{ start.format('HH:mm') }} - {{ end?.format('HH:mm') }}</div>
        <div border="r-[1px] solid"></div>
        <div flex="1">{{ fuzzy_time(consumed || 0) }}</div>
        <div border="r-[1px] solid"></div>
        <div>{{ consumedInHours }} hours</div>
      </div>
    </div>
    <div display="flex">
      <span>work:</span>
      <div flex="1">
        <a-input w="full" type="text" placeholder="Some work" p="x-1" v-model:value="state.work" />
      </div>
    </div>
    <div display="flex" align="items-center" justify="justify-center">
      <span>left: </span>
      <div flex="1" display="flex" gap="1" align="items-center" justify="justify-center">
        <a-input-number flex="1" type="number" v-model:value="state.left" p="x-1" style="flex: 1" placeholder="2" />
        <div>hour</div>
      </div>
    </div>
    <div display="flex" align="items-center">
      <span>fix</span>
      <a-radio-group v-model:value="state.inputType">
        <a-radio-button value="no">No</a-radio-button>
        <a-radio-button value="duration">Duration</a-radio-button>
        <a-radio-button value="end-time">End Time</a-radio-button>
      </a-radio-group>
    </div>
    <div display="flex" align="items-center" v-if="state.inputType == 'duration'">
      <span>duration: </span>
      <a-time-picker :show-now="false" v-model:value="state.inputDuration" format="HH:mm" style="flex: 1" />
    </div>
    <div display="flex" align="items-center" v-if="state.inputType == 'end-time'">
      <span>range: </span>
      <a-time-picker v-model:value="state.endTime" disabledSeconds format="HH:mm" style="flex: 1" />
    </div>
    <div display="flex" gap="1" justify="items-stretch">
      <a-button flex="1" @click="submit()" border="1px solid var(--foreground)">Submit</a-button>
      <a-button flex="1" @click="useRepo().cancelEffort()" border="1px solid var(--foreground)">Remove</a-button>
    </div>
  </div>
</template>
<style lang="sass" scoped>
div > span
  width: 90px
input
  max-width: 100% !important
  width: 100% !important
  display: block
</style>

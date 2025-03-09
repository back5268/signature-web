import { Cardz } from '@components/core';
import { TabPanel, TabView } from 'primereact/tabview';
import { TimekeepingLog } from './TimekeepingLog';
import { Timekeepingz } from './Timekeeping';
import { SyntheticTimekeeping } from './SyntheticTimekeeping';

export const Timekeeping = () => {
  return (
    <Cardz>
      <TabView>
        <TabPanel header="Lịch sử chấm công">
          <TimekeepingLog />
        </TabPanel>
        <TabPanel header="Bảng công máy">
          <Timekeepingz />
        </TabPanel>
        <TabPanel header="Bảng công tổng hợp">
          <SyntheticTimekeeping />
        </TabPanel>
      </TabView>
    </Cardz>
  );
};

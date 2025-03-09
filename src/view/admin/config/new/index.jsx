import { Cardz } from '@components/core';
import { TabPanel, TabView } from 'primereact/tabview';
import { Newz } from './Newz';
import { Log } from './Log';
export * from './DetailNewz';

export const New = () => {
  return (
    <Cardz>
      <TabView>
        <TabPanel header="Danh sách tin tức">
          <Newz />
        </TabPanel>
        <TabPanel header="Lịch sử gửi mail">
          <Log />
        </TabPanel>
      </TabView>
    </Cardz>
  );
};

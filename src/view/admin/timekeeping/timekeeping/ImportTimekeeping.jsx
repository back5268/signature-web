import { Import } from '@components/base';
import { importTimekeepingApi } from '@api';

export const ImportTimekeeping = (props) => {
  const { open, setOpen, setParams } = props;

  return (
    <Import
      action={importTimekeepingApi}
      handleSuccess={() => setParams((pre) => ({ ...pre, render: !pre.render }))}
      title="máy chấm công"
      template={'/import-timekeeping.xlsx'}
      open={open}
      setOpen={setOpen}
    />
  );
};

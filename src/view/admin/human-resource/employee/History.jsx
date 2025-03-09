import { getListWorkHistoryApi } from '@api';
import { employeeTypes } from '@constant';
import { formatNumber } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import { useDataState } from '@store';
import moment from 'moment';
import { Timeline } from 'primereact/timeline';
import { useParams } from 'react-router-dom';

export const History = () => {
  const { _id } = useParams();
  const { accounts } = useDataState();
  const { data } = useGetApi(getListWorkHistoryApi, { _id }, 'history');

  return (
    <div className="flex flex-wrap lg:px-16 my-16">
      <Timeline
        value={data}
        align="alternate"
        content={(item, index) => {
          const check = index === data.length - 1;
          const date = moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss');
          const title = check ? 'Thêm thông tin' : 'Cập nhật thông tin';
          let note = item.note;
          const dataz = item.after;
          if (check) {
            note = [
              `Loại nhân viên: ${employeeTypes.find((p) => p._id === dataz.type)?.name}`,
              `Lương cơ bản: ${formatNumber(dataz.salary)} VNĐ`
            ];
          }

          return (
            <div className="card p-8">
              <span className="font-semibold px-6 py-3 bg-primary text-white rounded-md w-max">{date}</span>
              <hr className="border border-primary mt-6" />
              <div className="flex flex-col mt-4 gap-2">
                <span className="font-semibold uppercase text-primary">{title}</span>
                <span>Người thao tác: {accounts?.find((u) => u._id === item.by)?.fullName || ''}</span>
                <span>Mô tả chi tiết:</span>
                <div className="border rounded-md border-primary/50">
                  <div className="flex flex-col gap-2 p-2">
                    {note.map((n, i) => (
                      <span key={i} className='border-b border-dashed border-primary my-1 py-1'> + {n}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

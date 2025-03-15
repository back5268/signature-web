import { Cardz, Columnz, Tablez } from "@components/core";

export const DepartmentReport = ({ data = [], templates }) => {
  
  return (
    <Cardz className="w-full h-full py-8">
      <hr className="mb-4" />
      <Tablez value={data?.map(d => {
        const datum = templates?.find(t => t._id === d.template)
        return { _id: d.template, name: datum?.title || "", count: d.count }
      })} rows={100} dataKey="_id" paginatorTemplate="" rowsPerPageOptions={[100]} params={{ page: 1, limit: 100 }}>
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        <Columnz header="Cam kết" field="name" />
        <Columnz header="Số người ký xác nhận" field="count" />
      </Tablez>
    </Cardz>
  );
};

import { updateContractApi } from '@api';
import { Buttonz, Dialogz, Editorz } from '@components/core';
import { BookmarkSquareIcon } from '@heroicons/react/24/outline';
import { PrinterIcon } from '@heroicons/react/24/solid';
import { useToastState } from '@store';
import { useEffect, useState } from 'react';

export const Print = (props) => {
  const { open, setOpen, account } = props;
  const { showToast } = useToastState();
  const [data, setData] = useState('');

  useEffect(() => {
    setData(open?.template);
  }, [JSON.stringify(open)]);

  const onView = () => {
    const newWindow = window.open('', '_blank');
    const htmlContent = `
      <html>
        <head>
          <title>Xem trước tài liệu</title>
        </head>
        <body>
          ${data}
        </body>
      </html>
    `;
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  };

  const onSave = async () => {
    const response = await updateContractApi({ account, _id: open?._id, template: data });
    if (response) showToast({ title: 'Lưu lại thành công!', severity: 'success' });
  }

  return (
    <Dialogz className="w-[1200px]" header="Thông tin hợp đồng" open={Boolean(open)} setOpen={setOpen}>
      <div className="felx flex-col gap-4">
        <div className="flex gap-4 justify-end mt-4 px-2">
          <Buttonz onClick={() => onView()} outlined className="flex justify-center gap-2">
            <PrinterIcon className="h-6 w-6" />
            Xem trước khi in
          </Buttonz>
          <Buttonz onClick={() => onSave()} className="flex justify-center gap-2">
            <BookmarkSquareIcon className="h-6 w-6" />
            Lưu lại
          </Buttonz>
        </div>
        <Editorz data={data} setData={(e) => setData(e)} />
      </div>
    </Dialogz>
  );
};

import { createResponseApi } from '@api';
import { useToastState } from '@store';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import parse from 'html-react-parser';
import { renderToString } from 'react-dom/server';
import moment from 'moment';

const EditableField = ({ id, initialValue, width, onUpdate }) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    onUpdate(id, value); // Cập nhật dữ liệu vào state của App
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
      style={{
        border: 'none',
        outline: 'none',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        background: 'transparent',
        padding: 0,
        margin: '4px',
        width: width ? width : 'auto'
      }}
    />
  );
};

export const EditorV2 = ({ data = '', setData = () => {}, slug }) => {
  const [dataz, setDataz] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [signature, setSignature] = useState(''); // Ảnh chữ ký
  const sigCanvas = useRef(null); // Tham chiếu đến canvas vẽ chữ ký
  const { showToast } = useToastState();
  const [editableData, setEditableData] = useState({});

  const handleUpdate = (id, value) => {
    setEditableData((prev) => ({ ...prev, [id]: value }));
  };

  const replaceDotsWithEditableField = (htmlString) => {
    let idCounter = 0;
    return parse(htmlString, {
      replace: (domNode) => {
        const isFull = domNode?.data?.match(/[…．。・•·‥‧⋯︙︰︵︶]+/g);
        if (domNode.type === 'text' && (isFull || domNode.data.includes('.....'))) {
          const id = idCounter++;
          return (
            <EditableField
              id={id}
              initialValue={editableData[id] || domNode.data.trim()}
              onUpdate={handleUpdate}
              width={isFull ? '100%' : undefined}
            />
          );
        }
        if (domNode.type === 'text' && domNode.data.includes('$ky_ten')) {
          return <button onClick={() => setShowModal(true)}>Ký tên</button>;
        }
      }
    });
  };

  function removeEmptyElements(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Duyệt qua tất cả các thẻ <p>
    doc.body.querySelectorAll('p, span, strong, em, div').forEach((el) => {
      // Lấy nội dung văn bản của phần tử (bao gồm khoảng trắng)
      const text = el.innerHTML.replace(/&nbsp;/g, '').trim();

      // Nếu rỗng sau khi loại bỏ &nbsp; => Xóa phần tử
      if (!text) {
        el.remove();
      }
    });

    return doc.body.innerHTML;
  }

  const saveSignature = async () => {
    const signatureData = sigCanvas.current.toDataURL('image/png'); // Lấy ảnh chữ ký
    const imgTag = `
    <div style="width: 100%; display: flex; justify-content: center; align-items: center">
    <img src="${signatureData}" alt="Chữ ký" style="max-width: 150px;"/>
    </div>
    `;
    setSignature(imgTag);
    const content = convertToHtml();
    const response = await createResponseApi({
      slug,
      content: removeEmptyElements(content?.replace('$ky_ten', imgTag))
    });
    if (response) {
      showToast({ title: 'Gửi phản hồi thành công', severity: 'success' });
      setShowModal(false);
    }
  };

  console.log(editableData);
  

  const convertToHtml = () => {
    let idCounter = 0;
    return data?.replace(/[…．。・•·‥‧⋯︙︰︵︶]+|(\.{5,})/g, (match) => {
      const id = idCounter++;
      let value = editableData[id]
        ? editableData[id].replace(/^\.+|\.+$/g, '').trim() // Loại bỏ dấu . ở đầu và cuối
        : '';

      if (!value) return match; // Nếu không có dữ liệu nhập, giữ nguyên `match`

      const firstChar = match[0]; // Lấy ký tự đầu tiên trong match (để xác định loại dấu)
      const totalLength = match.length - 20; // Độ dài gốc của chuỗi ký tự đặc biệt
      const sideChars = Math.max(1, Math.floor((totalLength - value.length) / 2)); // Số ký tự cần chèn hai bên
      const filler = firstChar.repeat(sideChars); // Chuỗi ký tự giống với ký tự trong match

      return `${filler}${value}${filler}`; // Kết hợp chuỗi dấu và nội dung nhập
    })?.replace('$ho_ten', editableData[0].replace(/^\.+|\.+$/g, '').trim());
  };

  return (
    <>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            style={{
              background: '#fff',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 400,
                height: 200,
                className: 'signature-canvas'
              }}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => sigCanvas.current.clear()}>Xóa</button>
              <button onClick={saveSignature} style={{ marginLeft: '10px' }}>
                Lưu
              </button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div>{replaceDotsWithEditableField(data)}</div>
    </>
  );
};

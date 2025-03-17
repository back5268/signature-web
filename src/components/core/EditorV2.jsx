import { createResponseApi } from '@api';
import { useToastState } from '@store';
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';

const EditableField = ({ id, initialValue, width, onUpdate, sub }) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    onUpdate(id, value); // Cập nhật dữ liệu vào state của App
  };

  if (sub)
    return (
      <div>
        {sub || ''}
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
      </div>
    );
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

export const EditorV2 = ({ data = '', slug }) => {
  const [showModal, setShowModal] = useState(false);
  const [signature, setSignature] = useState(''); // Ảnh chữ ký
  const sigCanvas = useRef(null); // Tham chiếu đến canvas vẽ chữ ký
  const { showToast } = useToastState();
  const [editableData, setEditableData] = useState({});
  const navigate = useNavigate();

  const handleUpdate = (id, value) => {
    setEditableData((prev) => ({ ...prev, [id]: value }));
  };

  const replaceDotsWithEditableField = (htmlString) => {
    let idCounter = 0;
    return parse(htmlString, {
      replace: (domNode) => {
        if (domNode.type === 'text' && (domNode.data.includes('.....'))) {
          const id = idCounter++;
          return (
            <EditableField
              id={id}
              initialValue={editableData[id] || domNode.data.trim().replace(/[^.]/g, '.')}
              onUpdate={handleUpdate}
              sub={domNode.data.trim().replaceAll('.', '')}
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
    doc.body.querySelectorAll('p, span, strong, em, div').forEach((el) => {
      const text = el.innerHTML.replace(/&nbsp;/g, '').trim();
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
      navigate(`/phan-hoi/${response?._id}`);
      showToast({ title: 'Gửi phản hồi thành công', severity: 'success' });
      setShowModal(false);
    }
  };

  const convertToHtml = () => {
    let idCounter = 0;
    return data
      ?.replace(/[…．。・•·‥‧⋯︙︰︵︶]+|(\.{5,})/g, (match) => {
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
      })
      ?.replace('$ho_ten', editableData[0].replace(/^\.+|\.+$/g, '').trim());
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

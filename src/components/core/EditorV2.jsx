import { createResponseApi } from '@api';
import { useToastState } from '@store';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export const EditorV2 = ({ data, setData = () => {}, slug }) => {
  const [dataz, setDataz] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [signature, setSignature] = useState(''); // Ảnh chữ ký
  const sigCanvas = useRef(null); // Tham chiếu đến canvas vẽ chữ ký
  const { showToast } = useToastState();

  const replaceSpansWithInputs = (html) => {
    let a = html.replace(
      '$ky_ten',
      `<span class="signature-placeholder" style="cursor: pointer; text-decoration: underline; display: flex; justify-content: center; align-items: center;">
          <strong class="signature-placeholder" style="display: flex; justify-content: center; align-items: center;">$ky_ten</strong>
        </span>`
    );
    return a.replace(
      /<span[^>]*>([\.\·\•\…｡ ]{3,})<\/span>/g, // Bắt dấu chấm + dấu cách ở cuối
      (match, dots) => {
        const cleanedDots = dots.trim(); // Xóa khoảng trắng đầu/cuối
        return `<input 
                      type="text" 
                      value="${cleanedDots}" 
                      style="width: auto; 
                             border: none; 
                             outline: none; 
                             background: transparent; 
                             font-size: 12pt; 
                             font-family: 'Times New Roman', serif; 
                             text-align: center;"
                        class="editable-input"
                    />`;
      }
    );
  };

  useEffect(() => {
    setData(dataz);
  }, [dataz]);

  const handleInputChange = (event) => {
    if (event.target.classList.contains('editable-input')) {
      const newValue = event.target.value;
    }
  };

  const handleClick = (event) => {
    if (event.target.classList.contains('signature-placeholder')) {
      setSelectedSpan(event.target);
      setShowModal(true);
    }
  };

  const saveSignature = async () => {
    if (selectedSpan) {
      const signatureData = sigCanvas.current.toDataURL('image/png'); // Lấy ảnh chữ ký
      setSignature(signatureData);
      const imgTag = `<img src="${signatureData}" alt="Chữ ký" style="max-width: 150px;"/>`;
      selectedSpan.outerHTML = imgTag;
      const response = await createResponseApi({ slug, content: document.getElementById('editor-container').innerHTML });
      if (response) {
        showToast({ title: 'Gửi phản hồi thành công', severity: 'success' });
        setShowModal(false);
      }
    }
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
                width: 280,
                height: 120,
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

      <div
        id="editor-container"
        onClick={handleClick}
        onInput={handleInputChange}
        dangerouslySetInnerHTML={{ __html: replaceSpansWithInputs(dataz || data || '') }}
      />
    </>
  );
};

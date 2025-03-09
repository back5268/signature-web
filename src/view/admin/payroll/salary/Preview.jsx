import { previewApprovedPayslipApi, previewPendingPayslipApi, previewPendingzPayslipApi, previewSalaryApi } from '@api';
import { useGetApi } from '@lib/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export const Preview = () => {
  const { _id } = useParams();
  const location = useLocation();
  const pathname = location?.pathname;
  const { data } = useGetApi(
    pathname?.includes('/approved-payslip')
      ? previewApprovedPayslipApi
      : pathname?.includes('/pending-payslip')
        ? previewPendingPayslipApi
        : pathname?.includes('/pending-payslip')
          ? previewPendingzPayslipApi
          : previewSalaryApi,
    { _id },
    'preview',
    Boolean(_id)
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'p') {
        console.log('User pressed Ctrl + P');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center"
      style={{ pageBreakInside: 'avoid', backgroundColor: '#FFF', fontFamily: 'sans-serif !important' }}
    >
      {data && typeof data === 'string' && <div style={{ pageBreakAfter: 'always' }} dangerouslySetInnerHTML={{ __html: data }} />}
    </div>
  );
};

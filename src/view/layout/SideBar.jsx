import { Logo } from '@components/base';
import { Buttonz } from '@components/core';
import { useEffect, useState } from 'react';
import { Squares2X2Icon, CircleStackIcon, Cog6ToothIcon, ArchiveBoxArrowDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { NavItem } from './NavItem';
import { NavGroup } from './NavGroup';
import { useLocation } from 'react-router-dom';
import { useUserState } from '@store';

const icons = {
  Squares2X2Icon,
  Cog6ToothIcon,
  ArchiveBoxArrowDownIcon,
  CircleStackIcon,
  EnvelopeIcon
};

export const SideBar = (props) => {
  const { showSidebar, onSignOut } = props;
  const { pathname } = useLocation();
  const [open, setOpen] = useState([]);
  const { tools } = useUserState();

  useEffect(() => {
    let item = null,
      indexz = null;
    if (pathname === '/') item = { name: 'Trang chủ', icon: 'Squares2X2Icon', route: '/' };
    else if (pathname === '/timekeeping-config') {
      item = { name: 'Cấu hình chấm công', icon: 'Squares2X2Icon', route: '/timekeeping-config' };
      indexz = 2;
    } else if (pathname === '/approved-payslip') {
      item = { name: 'Phiếu lương đã duyệt', icon: 'Squares2X2Icon', route: '/approved-payslip' };
      indexz = 3;
    } else if (pathname === '/salary-calculation') {
      item = { name: 'Tính toán công lương', icon: 'Squares2X2Icon', route: '/salary-calculation' };
      indexz = 3;
    } else {
      tools.forEach((tool, index) => {
        if (!['/', '/timekeeping-config', '/approved-payslip', '/salary-calculation'].includes(tool.route)) {
          if (tool.items?.length > 0) {
            tool.items.forEach((child) => {
              if (pathname?.includes(child.route)) {
                item = child;
                indexz = index;
              }
            });
          } else {
            if (pathname?.includes(tool.route)) {
              item = tool;
              indexz = index;
            }
          }
        }
      });
    }
    if (indexz >= 0 && !open?.includes(indexz + 1)) setOpen((pre) => [...pre, indexz + 1]);
    if (item) document.title = item?.name;
  }, [pathname]);

  return (
    <div
      className={`fixed left-0 inset-y-0 h-screen z-40 w-[17rem] flex flex-col justify-between border-r
      transition-all duration-500 ease-in-out shadow-custom bg-sidebar text-onSidebar ${showSidebar ? '' : '-translate-x-full'}`}
    >
      <div>
        <div className="p-4">
          <div className="flex justify-center items-center mb-2">
            <Logo classNameImg="h-16" />
          </div>
        </div>
        <hr className="bg-onSidebar" />
        <nav className="flex flex-col gap-1 text-sm font-normal text-inherit h-sidebar overflow-scroll mt-4 px-3">
          {tools?.map((item, index) => {
            const Icon = icons[item.icon];
            if (!item.items) return <NavItem key={index} item={item} pathname={pathname} Icon={Icon} />;
            else
              return <NavGroup key={index} item={item} value={index + 1} open={open} setOpen={setOpen} pathname={pathname} Icon={Icon} />;
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-onSidebar">
        <Buttonz outlined onClick={() => onSignOut()} className="w-full flex gap-2 truncate" label="Đăng xuất" />
      </div>
    </div>
  );
};

import React from "react";
import { Button, Tooltip } from "antd";
import { FaClock, FaTags } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { formatTimestampToDay, formatTimestampToTime } from "../../utils/date";
import ChooseTag from "../../components/ChooseTag";
import { tag } from "../../api/tag/type";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");
interface DesFieldProps {
  createdAt?: Date; // 创建时间的时间戳
  updatedAt?: Date; // 更新时间的时间戳
  initTags: tag[] | null; // 当前的标签
  onChange?: (tags: tag[]) => void;
}

const DesField: React.FC<DesFieldProps> = ({
  createdAt,
  updatedAt,
  initTags,
  onChange,
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      {/* 创建时间 */}
      {createdAt && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={dayjs(createdAt).fromNow()}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button type="text" icon={<FaClock color="#383a42" />}>
                {dayjs(createdAt).fromNow()}
              </Button>
            </div>
          </Tooltip>
        </div>
      )}
      {/* 更新时间 */}
      {updatedAt && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={dayjs(updatedAt).fromNow()}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button type="text" icon={<MdUpdate color="#383a42" />}>
                {dayjs(updatedAt).fromNow()}
              </Button>
            </div>
          </Tooltip>
        </div>
      )}
      {/* 标签 */}
      {initTags && initTags.length > 0 && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button type="link" icon={<FaTags color="#383a42" />}></Button>

          <ChooseTag
            auth={isAuthenticated}
            initTags={initTags}
            onChange={(e) => {
              if (!onChange) return;
              onChange(e);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DesField;

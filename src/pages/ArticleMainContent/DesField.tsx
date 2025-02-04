import React from "react";
import { Button, Tooltip } from "antd";
import { FaClock, FaTags } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { formatTimestampToDay, formatTimestampToTime } from "../../utils/date";
import ChooseTag from "../../components/ChooseTag";
import { tag } from "../../api/tag/type";

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
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* 创建时间 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={formatTimestampToTime(createdAt)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button type="text" icon={<FaClock color="#383a42" />}>
              {formatTimestampToDay(createdAt)}
            </Button>
          </div>
        </Tooltip>
      </div>

      {/* 更新时间 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={formatTimestampToTime(updatedAt)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button type="text" icon={<MdUpdate color="#383a42" />}>
              {formatTimestampToDay(updatedAt)}
            </Button>
          </div>
        </Tooltip>
      </div>
      {/* 标签 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button type="link" icon={<FaTags color="#383a42" />}></Button>
        <ChooseTag
          initTags={initTags}
          onChange={(e) => {
            if (!onChange) return;
            onChange(e);
          }}
        />
      </div>
    </div>
  );
};

export default DesField;

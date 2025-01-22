import React, { useEffect, useState } from "react";
import styles from "./LeftModalDom.module.scss";
import { FaTags } from "react-icons/fa";
import { getTag } from "../../api/tag";
import ChooseTag from "../ChooseTag";
import { tag } from "../../api/tag/type";
export default function Tag() {
  const [tags, setTags] = useState<tag[]>([]);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const res = await getTag();
    console.log(res);

    setTags(res.data);
  };
  return (
    <div className={styles.starContainer}>
      <div className={styles.middleInfo}>
        <FaTags className={styles.middleIcon} />
        <div className={styles.middleNum}>{tags.length}</div>
        <div className={styles.middleText}>标签</div>
      </div>
      <div className={styles.main}>
        {tags.length > 0 ? (
          <ChooseTag
            initTags={tags}
            onChange={(e) => setTags(e)}
            auth={false}
          ></ChooseTag>
        ) : (
          "目前还没有标签..."
        )}
      </div>
    </div>
  );
}

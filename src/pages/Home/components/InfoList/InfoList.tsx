import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Infolist.module.scss";
import { Button, Modal } from "antd";
import { FcLike } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { getProject } from "../../../../api/project";
import { ProjectItem } from "../../../../api/project/type";
import dayjs from "dayjs";
import Editor from "../../../../components/Editor/Editor";

interface InfoListProps {
  style?: React.CSSProperties;
}
const InfoList: React.FC<InfoListProps> = ({ style }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const res = await getProject();
    if (res.code == 0) {
      setProjects(res.data);
    }
  };

  const handleViewDetails = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div style={style} className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>项目产品</div>
        <div className={styles.desc}>
          设计及开发项目总结，不限于开发完成的项目，包括一些产品概念...
        </div>
      </div>
      <div className={styles.list}>
        {projects.map((info) => (
          <div className={styles.projectCard} key={info._id}>
            <img className={styles.img} src={info.img_url} alt="" />
            <div className={styles.title}>{info.title}</div>
            <div className={styles.date}>
              {dayjs(info.createdAt).format("YYYY-MM-DD")}
            </div>
            <div className={styles.classify}>{info.category}</div>
            <div className={styles.bottomBtn}>
              <Button icon={<FcLike />} className={styles.leftBtn}>
                {info.likes}
              </Button>
              <Button
                className={styles.rightBtn}
                onClick={() => handleViewDetails(info)}
              >
                瞧一瞧
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={selectedProject?.title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className={styles.detailModal}
        width={700}
      >
        {selectedProject && (
          <div>
            <img
              style={{ width: "100%" }}
              src={selectedProject.img_url}
              alt="项目图片"
              className={styles.modalImage}
            />
            <div className={styles.modalContent}>
              <div className={styles.infoRow}>
                <p>{selectedProject.category}</p>
                <p>{dayjs(selectedProject.createdAt).format("YYYY-MM-DD")}</p>
              </div>
              <p>
                <Editor
                  isSummary={true}
                  editable={false}
                  initialContent={selectedProject.content}
                ></Editor>
              </p>
              <div className={styles.modalButtons}>
                <Button
                  icon={<FcLike />}
                  className={styles.likeButton}
                  onClick={() => {
                    // 点赞逻辑
                  }}
                >
                  {selectedProject.likes}
                </Button>
                <Button
                  type="primary"
                  href={selectedProject.button_url}
                  target="_blank"
                  className={styles.githubButton}
                  icon={<FaGithub />}
                >
                  访问 GitHub
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default InfoList;

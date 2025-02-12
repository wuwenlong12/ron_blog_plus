import React, { useEffect, useState } from "react";
import styles from "./CataCard.module.scss";
import { Button, Carousel, Empty } from "antd";
import test from "../../../../assets/test.png";
import { getCarousel } from "../../../../api/carousel";
import { useScroll } from "framer-motion";
import { CarouselItem } from "../../../../api/carousel/type";
import { getPageStats } from "../../../../api/site";
import { PageStats } from "../../../../api/site/type";

export default function DataCard() {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  const [pageStats, setPageStats] = useState<PageStats>(null);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await getCarousel();
    if (res.code === 0) {
      setCarousels(res.data);
    }
    const res2 = await getPageStats();
    if (res2.code === 0) {
      setPageStats(res2.data);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardList}>
        <div className={`${styles.card} ${styles.first}`}>
          <div className={styles.num}>{pageStats?.totalPageView}</div>
          <div className={styles.desc}>总访问量</div>
        </div>
        <div className={`${styles.card} ${styles.second}`}>
          <div className={styles.num}>{pageStats?.todayPageView}</div>
          <div className={styles.desc}>今日访问</div>
        </div>
      </div>
      <div className={styles.slider}>
        {carousels.length > 0 ? (
          <Carousel dotPosition={"bottom"} autoplay>
            {carousels.map((item, index) => (
              <div key={index} className={styles.sliderItem}>
                <img className={styles.bgImg} src={item.img_url} alt="" />
                <div className={styles.title}>{item.title}</div>
                <div className={styles.subTitle}>{item.subtitle}</div>
                <div className={styles.desc}>{item.desc}</div>
                <div className={styles.btns}>
                  {item.buttons.map((button, idx) => (
                    <Button
                      key={idx}
                      className={`${styles.SecBtn} ${styles.Btn}`}
                      type="primary"
                      style={{ background: button.color }}
                      onClick={() => window.open(button.url, "_blank")}
                    >
                      {button.text}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className={styles.emptySlider}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className={styles.emptyContent}>
                  <p className={styles.emptyText}>作者还没有发布过公告</p>
                  <p className={styles.emptySubText}>敬请期待~</p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

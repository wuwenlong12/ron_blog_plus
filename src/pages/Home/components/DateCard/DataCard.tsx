import React, { useEffect, useState } from "react";
import styles from "./CataCard.module.scss";
import { Button, Carousel } from "antd";
import test from "../../../../assets/test.png";
import { getCarousel } from "../../../../api/carousel";
import { useScroll } from "framer-motion";
import { CarouselItem } from "../../../../api/carousel/type";
export default function DataCard() {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const res = await getCarousel();
    if (res.code === 0) {
      setCarousels(res.data);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.cardList}>
        <div className={`${styles.card} ${styles.first}`}>
          <div className={styles.num}>213323</div>
          <div className={styles.desc}>总访问量</div>
        </div>
        <div className={`${styles.card} ${styles.second}`}>
          <div className={styles.num}>213323</div>
          <div className={styles.desc}>今日访问</div>
        </div>
      </div>
      <div className={styles.slider}>
        <Carousel dotPosition={"bottom"} autoplay>
          {carousels.map((item, index) => (
            <div className={styles.sliderItem}>
              <img className={styles.bgImg} src={item.img_url} alt="" />
              <div className={styles.title}>{item.title}</div>
              <div className={styles.subTitle}>{item.subtitle}</div>
              <div className={styles.desc}>{item.desc}</div>
              <div className={styles.btns}>
                {item.buttons.map((button) => (
                  <Button
                    className={`${styles.SecBtn} ${styles.Btn}`}
                    type="primary"
                    style={{ background: button.color }}
                    onClick={() => (window.location.href = button.url)}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

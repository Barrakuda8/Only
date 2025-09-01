import React, { useState, useRef, useEffect } from 'react';
import * as styles from './historySection.module.scss';
import * as periodsStyles from '@components/Items/PeriodsSliderItem/periodsSliderItem.module.scss';
import data from "@json/database.json";
import SliderArrow from '@components/Items/sliderArrow';
import EventsSlider from '../EventsSlider';
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import "swiper/scss/effect-fade";
import PeriodsSliderItem from '@components/Items/PeriodsSliderItem';

gsap.registerPlugin(MotionPathPlugin);

const HistorySection = ({}) => {

    const swiperRef = useRef<any>(null);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const boxRefs: React.RefObject<HTMLDivElement | null>[] = [];
    const leftArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const rightArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const totalOrder: number = data.length;
    const [currentSlide, setCurrentSlide] = useState(0);
    const radius: number = 265;
    const startingPointAngle = 2 * Math.PI / 3;
    let coords: [number, number][] = [];
    for(let i = 0; i < totalOrder; i++) {
        const angle: number = startingPointAngle + 2 * Math.PI * i / totalOrder;
        const x: number = radius * Math.cos(angle);
        const y: number = radius * Math.sin(angle);
        coords.push([x, y]);

        boxRefs.push(useRef<HTMLDivElement>(null));
    }

    useEffect(() => {
        if (swiperInstance && leftArrowRef.current && rightArrowRef.current) {
            swiperInstance.params.navigation.prevEl = leftArrowRef.current;
            swiperInstance.params.navigation.nextEl = rightArrowRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    const changeSlideAnimation = (reverse: boolean, diff: number): void => {
        for(let i in boxRefs) {
            const ref: React.RefObject<HTMLDivElement | null> = boxRefs[i];
            const el: HTMLDivElement | null = ref.current;
            let current: number = parseInt(i) - currentSlide;
            current = current < 0 ? totalOrder + current : current;
            let next: number = current - diff;
            if(next > totalOrder - 1) {
                next = next - totalOrder;
            } else if(next < 0) {
                next = totalOrder + next;
            };
            if(next == 0) {
                el?.classList.add(periodsStyles.activeDot);
            } else {
                el?.classList.remove(periodsStyles.activeDot);
            }

            gsap.to(el, {
                duration: 1,
                repeat: 0,
                ease: 'power1.out',
                motionPath: {
                    path: `M0,0 A${radius},${radius} ${reverse ? '0 0 1' : '1 0 0'} ${coords[current][0] - coords[next][0]},${coords[current][1] - coords[next][1]}`,
                    autoRotate: false,
                },
                onComplete: () => {
                    if(el != null) {
                        el.style.left = (radius - coords[next][0]) + 'px';
                        el.style.top = (radius - coords[next][1]) + 'px';
                        el.style.transform = `translate(-50%, -50%)`;
                    }
                }
            });
        }
    }

    return (
        <section className={styles.sectionWrapper}>
            <div className={styles.section}>
                <h1 className={styles.heading}>Исторические<br/>даты</h1>
                <div className={styles.sliderWrapper}>
                    <div className={styles.sliderDate}>
                        <span className={styles.sliderStartDate}>{data[currentSlide].startDate}</span>
                        &nbsp;&nbsp;
                        <span className={styles.sliderEndDate}>{data[currentSlide].endDate}</span>
                    </div>
                </div>
                <div className={styles.swiperWrapper}>
                    <Swiper
                        modules={[Navigation, Pagination, EffectFade]}
                        spaceBetween={0}
                        slidesPerView={1}
                        effect="fade"
                        speed={2000}
                        fadeEffect={{ crossFade: true }}
                        navigation={{
                            prevEl: leftArrowRef.current,
                            nextEl: rightArrowRef.current,
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            setSwiperInstance(swiper);
                        }}
                        onSlideChange={(swiper) => {
                            const diff: number = swiper.activeIndex - currentSlide;
                            let reverse: boolean = diff < 0;
                            if(Math.floor(totalOrder / 2) < Math.abs(diff)) {
                                reverse = !reverse;
                            }
                            setCurrentSlide(swiper.activeIndex);
                            changeSlideAnimation(reverse, diff);
                        }}
                    >
                        {
                            data.map((slide, i) => (
                                <SwiperSlide>
                                    <EventsSlider events={slide.events} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
                <div className={styles.arrowsWrapper}>
                    <div className={styles.orderWrapper}>
                        <span>{currentSlide + 1}</span>/
                        <span>{totalOrder}</span>
                    </div>
                    <div className={styles.arrows}>
                        <SliderArrow unavailable={currentSlide == 0} ref={leftArrowRef} />
                        <SliderArrow right={true} unavailable={currentSlide == totalOrder - 1} ref={rightArrowRef} />
                    </div>
                </div>
                <div className={styles.horizontalBackgroundLine}></div>
                <div className={styles.backgroundCircleWrapper}>
                    <div className={styles.backgroundCircle}>
                        {
                            boxRefs.map((ref, i) => 
                                <PeriodsSliderItem 
                                    radius={radius}
                                    coords={coords[i]}
                                    i={i}
                                    name={data[i].name}
                                    ref={ref}
                                    swiperRef={swiperRef}
                                    key={i}
                                />)
                        }
                    </div>
                </div>
            </div>
            <div className={styles.verticalBackgroundLine}></div>
        </section>
    )
}

export default HistorySection;
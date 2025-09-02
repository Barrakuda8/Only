import React, { useState, useRef } from 'react';
import * as styles from './historySection.module.scss';
import * as periodsStyles from '@components/Items/PeriodsSliderItem/periodsSliderItem.module.scss';
import * as arrowStyles from '@components/Items/SliderArrow/sliderArrow.module.scss';
import * as eventsStyles from '@components/Sections/EventsSlider/eventsSlider.module.scss';
import data from "@json/database.json";
import SliderArrow from '@components/Items/SliderArrow';
import EventsSlider from '@components/Sections/EventsSlider';
import PeriodsSliderItem from '@components/Items/PeriodsSliderItem';
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

gsap.registerPlugin(MotionPathPlugin);

const HistorySection = ({}) => {

    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [startDate, setStartDate] = useState(data[currentSlide]?.startDate);
    const [endDate, setEndDate] = useState(data[currentSlide]?.endDate);

    const boxRefs: React.RefObject<HTMLDivElement | null>[] = [];
    const leftArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const rightArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const duration: number = 1;
    const radius: number = 265;
    const totalOrder: number = Math.min(data.length, 6);
    const startingPointAngle = 2 * Math.PI / 3;

    let coords: [number, number][] = [];
    for(let i = 0; i < totalOrder; i++) {
        const angle: number = startingPointAngle + 2 * Math.PI * i / totalOrder;
        const x: number = radius * Math.cos(angle);
        const y: number = radius * Math.sin(angle);
        coords.push([x, y]);
        boxRefs.push(useRef<HTMLDivElement>(null));
    }

    const startDateAnimation = (current: number, diff: number, setter: React.Dispatch<React.SetStateAction<number>>): void => {
        let count: number = 0;
        let step: number = diff > 0 ? 1 : -1;
        const interval = window.setInterval(() => {
            if(count == diff) {
                window.clearInterval(interval);
            } else {
                count = count + step;
                setter(current + count);
            }
        }, Math.floor(duration * 1000 / Math.abs(diff)))
    }

    const startDatesAnimation = (current: number, next: number): void => {
        const currentStartDate: number = data[current].startDate;
        const nextStartDate: number = data[next].startDate;
        const currentEndDate: number = data[current].endDate;
        const nextEndDate: number = data[next].endDate;
        const startDiff: number = nextStartDate - currentStartDate;
        const endDiff: number = nextEndDate - currentEndDate;

        startDateAnimation(currentStartDate, startDiff, setStartDate);
        startDateAnimation(currentEndDate, endDiff, setEndDate);
    }

    const startSlidesAnimation = (swiper: SwiperType, activeIndex: number): void => {
        const oldSlide = swiper.slides[currentSlide].querySelector('.' + eventsStyles.slider);
        const newSlide = swiper.slides[activeIndex].querySelector('.' + eventsStyles.slider);

        const smallDuration: number = duration / 3;

        gsap.to(oldSlide, {
            opacity: 0,
            duration: smallDuration,
            onComplete: () => {
                swiper.allowSlideNext = true;
                swiper.allowSlidePrev = true;
                swiper.slideTo(activeIndex);

                window.setTimeout(() => {
                    gsap.fromTo(
                        newSlide,
                        { opacity: 0 },
                        { opacity: 1, duration: smallDuration }
                    );
                }, smallDuration * 1000)
            },
        });
    }

    const startPeriodsAnimation = (reverse: boolean, diff: number): void => {
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
                duration: duration,
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
                    if(parseInt(i) == totalOrder - 1) {
                        swiperInstance.allowSlideNext = true;
                        swiperInstance.allowSlidePrev = true;

                        leftArrowRef.current?.classList.remove(arrowStyles.disabled);
                        rightArrowRef.current?.classList.remove(arrowStyles.disabled);
                        for(let ref of boxRefs) {
                            ref.current?.classList.remove(periodsStyles.disabled);
                        }
                    }
                }
            });
        }
    }

    const changeSlide = (swiper: SwiperType, activeIndex: number) => {
        swiper.allowSlideNext = false;
        swiper.allowSlidePrev = false;

        leftArrowRef.current?.classList.add(arrowStyles.disabled);
        rightArrowRef.current?.classList.add(arrowStyles.disabled);
        for(let ref of boxRefs) {
            ref.current?.classList.add(periodsStyles.disabled);
        }
        const diff: number = activeIndex - currentSlide;
        let reverse: boolean = diff < 0;
        if(Math.floor(totalOrder / 2) < Math.abs(diff)) {
            reverse = !reverse;
        }
        
        startDatesAnimation(currentSlide, activeIndex);
        startSlidesAnimation(swiper, activeIndex);
        setCurrentSlide(activeIndex);
        startPeriodsAnimation(reverse, diff);
    }

    return (
        <section className={styles.sectionWrapper}>
            <div className={styles.section}>
                <h1 className={styles.heading}>Исторические<br/>даты</h1>
                <div className={styles.sliderWrapper}>
                    <div className={styles.sliderDate}>
                        <span className={styles.sliderStartDate}>{startDate}</span>
                        &nbsp;&nbsp;
                        <span className={styles.sliderEndDate}>{endDate}</span>
                    </div>
                </div>
                <div className={styles.swiperWrapper}>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        allowTouchMove={false}
                        onSwiper={(swiper) => {
                            setSwiperInstance(swiper);
                        }}
                    >
                        {
                            data.map((slide, i) => (
                                <SwiperSlide key={i}>
                                    <EventsSlider 
                                        events={slide.events} 
                                        name={slide.name} 
                                        firstSlide={i == 0} 
                                    />
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
                        <SliderArrow 
                            unavailable={currentSlide == 0} 
                            ref={leftArrowRef} 
                            onClick={() => changeSlide(swiperInstance, currentSlide == 0 ? totalOrder - 1 : currentSlide - 1)}
                        />
                        <SliderArrow 
                            right={true} 
                            unavailable={currentSlide == totalOrder - 1} 
                            ref={rightArrowRef} 
                            onClick={() => changeSlide(swiperInstance, currentSlide == totalOrder - 1 ? 0 : currentSlide + 1)}
                        />
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
                                    onClick={() => changeSlide(swiperInstance, i)}
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
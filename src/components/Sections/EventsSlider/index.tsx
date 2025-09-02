import React, {useRef, useState, useLayoutEffect} from 'react';
import * as styles from './eventsSlider.module.scss';
import SliderArrow from '@components/Items/SliderArrow';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventSliderItem from '@components/Items/EventSliderItem';
import 'swiper/scss';
import 'swiper/scss/navigation';

type Props = {
    events: EventStructure[],
    name: string,
    firstSlide: boolean
}

const EventsSlider = ({
    events,
    name,
    firstSlide=false
}: Props) => {

    const leftArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const rightArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    useLayoutEffect(() => {
        if (!swiperInstance || !leftArrowRef.current || !rightArrowRef.current) return;

        swiperInstance.params.navigation = {
            ...(swiperInstance.params.navigation as any),
            prevEl: leftArrowRef.current,
            nextEl: rightArrowRef.current,
        };

        swiperInstance.navigation.destroy();
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
    });

    return (
        <div 
            className={styles.slider} 
            style={firstSlide ? {opacity: 1} : {}}
        >
            <h3 className={styles.name}>{name}</h3>
            <div className={styles.mobileLine}></div>
            <div className={styles.swiperWrapper}>
                <SliderArrow 
                    background={true} 
                    unavailable={isBeginning} 
                    ref={leftArrowRef} 
                />
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={80}
                    slidesPerView={3}
                    nested={true}
                    speed={1000}
                    navigation={{
                        prevEl: leftArrowRef.current,
                        nextEl: rightArrowRef.current,
                        enabled: true
                    }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.5,
                            spaceBetween: 25
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 80
                        }
                    }}
                    onBeforeInit={(swiper) => {
                        setIsEnd(swiper.isEnd);
                    }}
                    onSwiper={(swiper) => {
                        setSwiperInstance(swiper);
                    }}
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                >
                    {
                        events.map((event, i) => (
                            <SwiperSlide key={i}>
                                <EventSliderItem 
                                    date={event.date} 
                                    description={event.description} 
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <SliderArrow 
                    background={true} 
                    right={true} 
                    unavailable={isEnd} 
                    ref={rightArrowRef}
                />
            </div>
        </div>
    )
}

export default EventsSlider;
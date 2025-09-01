import React, {useRef, useState} from 'react';
import * as styles from './eventsSlider.module.scss';
import { Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventSliderItem from '@components/Items/EventSliderItem';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/scrollbar';
import SliderArrow from '@components/Items/sliderArrow';

type Props = {
    events: EventStructure[]
}

const EventsSlider = ({
    events
}: Props) => {

    const leftArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const rightArrowRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    return (
        <div className={styles.swiperWrapper}>
            <SliderArrow background={true} unavailable={isBeginning} ref={leftArrowRef} />
            <Swiper
                modules={[Navigation, Scrollbar]}
                spaceBetween={80}
                slidesPerView={3}
                onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation !== "boolean") {
                        const navigation = swiper.params.navigation as any;
                        navigation.prevEl = leftArrowRef.current;
                        navigation.nextEl = rightArrowRef.current;
                    }
                    setIsEnd(swiper.isEnd)
                }}
                navigation={{
                    prevEl: leftArrowRef.current,
                    nextEl: rightArrowRef.current,
                    enabled: true
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1.5,
                        navigation: { enabled: false }
                    },
                    768: {
                        slidesPerView: 3,
                        navigation: { 
                            prevEl: leftArrowRef.current,
                            nextEl: rightArrowRef.current,
                            enabled: true 
                        }
                    }
                }}
                scrollbar={{ draggable: true }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {
                    events.map((event, i) => (
                        <SwiperSlide>
                            <EventSliderItem date={event.date} description={event.description} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <SliderArrow background={true} right={true} unavailable={isEnd} ref={rightArrowRef} />
        </div>
    )
}

export default EventsSlider;
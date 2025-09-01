import React from 'react';
import * as styles from './eventSliderItem.module.scss';

type Props = {
    date: string,
    description: string
};

const EventSliderItem = ({
    date,
    description
}: Props) => {

    return (
        <div className={styles.item}>
            <div className={styles.date}>{date}</div>
            <p className={styles.description}>{description}</p>
        </div>
    )
}

export default EventSliderItem;
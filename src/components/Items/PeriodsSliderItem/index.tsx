import React from 'react';
import cn from 'classnames';
import * as styles from './periodsSliderItem.module.scss';

type Props = {
    radius: number,
    coords: [number, number],
    i: number,
    name: string,
    ref: React.RefObject<HTMLDivElement | null>,
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const PeriodsSliderItem = ({
    radius,
    coords,
    i,
    name,
    ref,
    onClick
}: Props) => {

    return (
        <div 
            className={i == 0 ? cn(styles.dotWrapper, styles.activeDot) : styles.dotWrapper} 
            style={{ left: `${radius - coords[0]}px`, top: `${radius - coords[1]}px` }} 
            ref={ref} 
        >
            <div 
                className={styles.dot}
                onClick={onClick}
            >
                {i + 1}
                <div className={styles.name}>{name}</div>
            </div>
        </div>
    )
}

export default PeriodsSliderItem;
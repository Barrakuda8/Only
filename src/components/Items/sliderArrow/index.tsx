import React from 'react';
import * as styles from './sliderArrow.module.scss';
import cn from 'classnames';
import arrowImg from '@media/img/sliderArrow.svg';

type Props = {
    right?: boolean,
    background?: boolean,
    unavailable?: boolean,
    ref: React.RefObject<HTMLDivElement | null>
}

const SliderArrow = ({
    right = false,
    background = false,
    unavailable = false,
    ref
}: Props) => {

    let classNames: string[] = [styles.arrow];
    if(right) classNames.push(styles.right);
    if(background) classNames.push(styles.background);
    if(unavailable) classNames.push(styles.unavailable);

    return (
        <div className={cn(...classNames)} ref={ref}>
            <img 
                src={arrowImg} 
                alt={right ? 'right' : 'left'}
                className={styles.arrowImg}
             />
        </div>
    )
}

export default SliderArrow;
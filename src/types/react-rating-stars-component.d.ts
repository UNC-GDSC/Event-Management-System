declare module 'react-rating-stars-component' {
  import { FC } from 'react';

  interface ReactStarsProps {
    count?: number;
    onChange?: (newRating: number) => void;
    size?: number;
    activeColor?: string;
    color?: string;
    value?: number;
    char?: string;
    edit?: boolean;
    isHalf?: boolean;
    emptyIcon?: React.ReactElement;
    halfIcon?: React.ReactElement;
    filledIcon?: React.ReactElement;
    a11y?: boolean;
    classNames?: string;
  }

  const ReactStars: FC<ReactStarsProps>;
  export default ReactStars;
}

import React, { FC } from 'react';
import styles from './TimeComponent.module.scss';

interface TimeComponentProps {}

const TimeComponent: FC<TimeComponentProps> = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = new Date(time).toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit'
  });

  return (
    <div className={styles.TimeComponent}>
      <p className="text-white mb-0">{formattedTime}</p>
    </div>
  );
};

export default TimeComponent;

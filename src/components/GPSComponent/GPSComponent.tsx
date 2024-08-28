import React, { FC } from 'react';
import styles from './GPSComponent.module.scss';

interface GPSComponentProps {}

const GPSComponent: FC<GPSComponentProps> = () => (
  <div className={styles.GPSComponent}>
    <p className="text-white mb-0">TODO: GPS COORDINATES</p>
  </div>
);

export default GPSComponent;

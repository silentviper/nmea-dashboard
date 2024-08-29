import React, { FC, useState, useEffect } from 'react';
import styles from './GPSComponent.module.scss';

interface GPSComponentProps {}

const GPSComponent: FC<GPSComponentProps> = () => {


  return (
    <div className={styles.GPSComponent}>
      <p className="mb-0">GPS</p>
    </div>
  );
};

export default GPSComponent;
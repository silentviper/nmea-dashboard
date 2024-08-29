import React, { FC, useState, useEffect } from 'react';
import styles from './GaugesComponent.module.scss';

interface GaugesComponentProps {}

const GaugesComponent: FC<GaugesComponentProps> = () => {


  return (
    <div className={styles.GaugesComponent}>
      Gauges
    </div>
  );
};

export default GaugesComponent;
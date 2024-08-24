import React, { FC } from 'react';
import styles from './GaugesComponent.module.scss';

interface GaugesComponentProps {}

const GaugesComponent: FC<GaugesComponentProps> = () => (
  <div className={styles.GaugesComponent}>
    GaugesComponent Component
  </div>
);

export default GaugesComponent;

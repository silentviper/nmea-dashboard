import React, { FC } from 'react';
import styles from './StatusBarComponent.module.scss';
import Image from 'next/image';

import LogoComponent from "../logo.jsx";
import TimeComponent from '../TimeComponent/TimeComponent';


interface StatusBarComponentProps {}

const StatusBarComponent: FC<StatusBarComponentProps> = () => {

  return (<div className={styles.StatusBarComponent}>
    <div></div>
    <div className={styles.logoBox}>
      <LogoComponent />
    </div>
    <div className={styles.timeBox}>
      <TimeComponent />
    </div>
  </div>);
};

export default StatusBarComponent;

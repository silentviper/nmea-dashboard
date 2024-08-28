import React, { FC } from 'react';
import styles from './StatusBarComponent.module.scss';
import Image from 'next/image';

import LogoComponent from "../logo.jsx";
import TimeComponent from '../TimeComponent/TimeComponent';
import GPSComponent from '../GPSComponent/GPSComponent';


export default function StatusBarComponent() {

  return (<div className={styles.StatusBarComponent}>
    <div className={styles.gpsBox}>
      <GPSComponent></GPSComponent>
    </div>
    <div className={styles.logoBox}>
      <LogoComponent></LogoComponent>
    </div>
    <div className={styles.timeBox}>
      <TimeComponent></TimeComponent>
    </div>
  </div>);
};

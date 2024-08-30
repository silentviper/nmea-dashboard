import React, { FC } from 'react';
import styles from './StatusBarComponent.module.scss';
// import Image from 'next/image';

import LogoComponent from "../logo.jsx";
import TimeComponent from '../TimeComponent/TimeComponent';
import GPSComponent from '../GPSComponent/GPSComponent';


export default function StatusBarComponent() {
  function reloadPage() {
    window.location.reload();
  }

  return (<div className={styles.StatusBarComponent}>
    <div className={styles.gpsBox}>
      <GPSComponent></GPSComponent>
    </div>
    <div className={styles.logoBox}>
      {/* <LogoComponent></LogoComponent>
       */}
      <img src="assets/img/logo.png" alt="Logo" width={250} height={40} />
    </div>
    <div className={styles.timeBox}>
      <input type="button" value="Reload page" onClick={reloadPage} />
    </div>
  </div>);
};

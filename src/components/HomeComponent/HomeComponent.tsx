import React, { FC, useEffect, useState  } from 'react';
import styles from './HomeComponent.module.scss';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import GaugesComponent from '../GaugesComponent/GaugesComponent';
import StatusBarComponent from '../StatusBarComponent/StatusBarComponent';


interface HomeComponentProps {}

const HomeComponent: FC<HomeComponentProps> = () => {
  const paths = [
    {
      "path": "electrical.switches.bank.144.1.state",
      "name": "Bilge Pump 1"
    },
    {
      "path": "electrical.switches.bank.144.2.state",
      "name": "Bilge Pump 2"
    },
    {
      "path": "electrical.switches.bank.144.3.state",
      "name": "Bait Tank"
    },
    {
      "path": "electrical.switches.bank.144.4.state",
      "name": "?"
    },
    {
      "path": "electrical.switches.bank.144.5.state",
      "name": "?"
    },
    {
      "path": "electrical.switches.bank.144.6.state",
      "name": "?"
    },
    {
      "path": "electrical.switches.bank.144.7.state",
      "name": "?"
    },
    {
      "path": "electrical.switches.bank.144.8.state",
      "name": "?"
    },
    {
      "path": "electrical.switches.bank.144.9.state",
      "name": "?"
    },
    {
      "path": "electrical.switches.bank.144.10.state",
      "name": "Bilge Blower"
    },
    {
      "path": "electrical.switches.bank.144.11.state",
      "name": "Nav Lights"
    },
    {
      "path": "electrical.switches.bank.144.12.state",
      "name": "Washdown"
    }
  ];

  return (
    <div className={styles.HomeComponent}>
      <StatusBarComponent></StatusBarComponent>
      <div className={`${styles.gaugeBox}`}>
        <GaugesComponent></GaugesComponent>
      </div>
      <div className="">
        <div className={styles.switchBox}>
        {paths.map((value) => (
          <div key={value.path}>
            <ToggleSwitch path={value.path} name={value.name} />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;

import React, { FC, useState, useEffect } from 'react';
import styles from './GaugesComponent.module.scss';

interface GaugesComponentProps {}

const GaugesComponent: FC<GaugesComponentProps> = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setLogs(prevLogs => [...prevLogs, `LOG: ${args.join(' ')}`]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs(prevLogs => [...prevLogs, `ERROR: ${args.join(' ')}`]);
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  return (
    <div className={styles.GaugesComponent}>
      {logs.map((log, index) => (
        <p className='text-white' key={index}>{log}</p>
      ))}
    </div>
  );
};

export default GaugesComponent;
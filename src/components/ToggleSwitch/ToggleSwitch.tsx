import React, { FC, useEffect, useState } from 'react';
import styles from './ToggleSwitch.module.scss';
import axios from 'axios';

// import button from '../../core/components'


interface ToggleSwitchProps {
  path: string;
  name: string;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ path, name }) => {
  const [enabled, setEnabled] = useState(false);
  
  const handleToggle = (element: any) => {
    console.log(element)
    element.target.blur()
    try {
      axios({
        method: "PUT",
        url: `http://${location.host}/signalk/v1/api/vessels/self/` + path.replace(/\./g, '/'),
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkphbWVzTWNHaW5uZXNzIiwiaWF0IjoxNzI0MTE5NjgzfQ.2li_BlgX_4EaIi9XFGXG8JUwKe3-ThlJBMUdVViS4G8",
          "Content-Type": "application/json"
        },
        data: {
          value: !enabled
        }
      });
    } catch (error) {
      console.error("Error making PUT request:", error);
    }
  }

  useEffect(() => {
    try {
      const socket = new WebSocket(`ws://${location.host}/signalk/v1/stream?subscribe=none`);

      // Event handler for when the connection is established
      socket.onopen = function(event) {
          console.log('WebSocket connection established');
          // You can send initial data to the server here if needed
  
          // Fetch the state of all electrical.switches.bank.144.* switches
          const request = {
              context: 'vessels.self',
              subscribe: [{
                  path: path,
                  period: 500
              }]
          };
          socket.send(JSON.stringify(request));
      };
  
      socket.onmessage = (event) => {
        // console.log('Message from server:', event.data);
        const message = JSON.parse(event.data);
        const value = message.updates?.[0]?.values?.[0]?.value;
        if (value !== undefined) {
          setEnabled(value);
        } 
        // setEnabled(value ?? false);
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      socket.onerror = (error) => {
        // console.error('WebSocket error:', error);
      };
  
      return () => {
        socket.close();
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [path]);

  return (
    <div className={`${styles.ToggleSwitch}`}>
      <span className={`${styles.metal} ${styles.radial} ${enabled ? styles.on : ''}`} onClick={((e) => handleToggle(e))}>
        <span style={{ color: enabled ? 'green' : 'red' }}>&nbsp;</span>
      </span>
      <div>{name}</div> 
      
      {/* <input type="checkbox" checked={enabled} onChange={() => handleToggle} /> */}
    </div>
  );
};

export default ToggleSwitch;
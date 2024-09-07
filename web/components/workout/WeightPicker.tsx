import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';

interface WeightPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const WeightPicker: React.FC<WeightPickerProps> = ({ value, onChange }) => {
  const [weight, setWeight] = useState({ kg: '0', g: '0' });

  useEffect(() => {
    const [kg, g] = value.split('.');
    setWeight({ kg: kg || '0', g: g?.padEnd(2, '0') || '0' });
  }, [value]);

  const generateKgOptions = () => {
    const options = [];
    // 0から10までは1キロ単位
    for (let i = 0; i <= 10; i++) {
      options.push(String(i));
    }
    // 12から28までは2キロ単位、ただし25は含める
    for (let i = 12; i <= 28; i += 2) {
      if (i === 26) {
        options.push('25');
      }
      options.push(String(i));
    }

    // 30以降は1の位を0,2,5,7で表示
    for (let i = 30; i <= 300; i += 10) {
      options.push(String(i), String(i + 2), String(i + 5), String(i + 7));
    }
    return options;
  };

  const kgOptions = generateKgOptions();
  const gOptions = ['0', '5'];

  const handleChange = (newWeight: { kg: string; g: string }) => {
    setWeight(newWeight);
    onChange(`${newWeight.kg}.${newWeight.g}`);
  };

  return (
    <div className="weight-picker" style={{ width: '150px', height: '120px', overflow: 'hidden' }}>
      <Picker
        value={weight}
        onChange={handleChange}
        height={120}
        itemHeight={40}
      >
        <Picker.Column name="kg">
          {kgOptions.map(kg => <Picker.Item key={kg} value={kg}>{kg}</Picker.Item>)}
        </Picker.Column>
        <span className="flex items-center h-full">.</span>
        <Picker.Column name="g">
          {gOptions.map(g => <Picker.Item key={g} value={g}>{g}</Picker.Item>)}
        </Picker.Column>
      </Picker>
    </div>
  );
};

export default WeightPicker;
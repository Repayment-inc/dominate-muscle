import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';

interface RepPickerProps {
  value: string;
  onChange: (value: string) => void;
} 

export const RepPicker: React.FC<RepPickerProps> = ({ value, onChange }) => {

    const [reps, setReps] = useState({ reps: '0' });

    useEffect(() => {
        setReps({ reps: value });
    }, [value]);

    const generateRepsOptions = () => {
        const options = [];
        for (let i = 0; i <= 100; i++) {
            options.push(String(i));
        }
        return options;
    };

    const handleRepsChange = (value: { reps: string }) => {
        setReps(value);
        onChange(value.reps);
    };

    const repsOptions = generateRepsOptions();

    return (
        <div className="rep-picker" style={{ width: '150px', height: '120px', overflow: 'hidden' }}>
            <Picker
                value={reps}
                onChange={handleRepsChange}
                height={120}
                itemHeight={40}
            >
                <Picker.Column name="reps">
                    {repsOptions.map(rep => <Picker.Item key={rep} value={rep}>{rep}</Picker.Item>)}
                </Picker.Column>
            </Picker>
        </div>
    );
};

export default RepPicker;

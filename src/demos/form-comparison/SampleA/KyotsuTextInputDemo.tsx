import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import KyotsuTextInput from '../../../components/legacy/KyotsuTextInput ';

const KyotsuTextInputDemo: React.FC = () => {
    const [value1, setValue1] = useState<string>('');
    const [value2, setValue2] = useState<number>(0);
    const [value3, setValue3] = useState<string>('');

    const handleChange1 = (value: string | number) => setValue1(value.toString());
    const handleChange2 = (value: string | number) => setValue2(Number(value));
    const handleChange3 = (value: string | number) => setValue3(value.toString());

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                KyotsuTextInput デモ
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    日本語入力デモ
                </Typography>
                <KyotsuTextInput
                    label="日本語入力"
                    value={value1}
                    onChange={handleChange1}
                    type="0"
                    maxlength={20}
                    format="0"
                    inputmode="0"
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    数値入力デモ
                </Typography>
                <KyotsuTextInput
                    label="金額入力"
                    value={value2}
                    onChange={handleChange2}
                    type="3"
                    maxlength={10}
                    moneyunit="2"
                    decimalplace={0}
                    unit="円"
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    半角英数入力デモ
                </Typography>
                <KyotsuTextInput
                    label="コード入力"
                    value={value3}
                    onChange={handleChange3}
                    type="4"
                    maxlength={8}
                    format="1"
                />
            </Paper>
        </Box>
    );
};

export default KyotsuTextInputDemo; 
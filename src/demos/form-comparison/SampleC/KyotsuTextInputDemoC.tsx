import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import KyotsuTextInputC from './KyotsuTextInputC';

interface FormInputs {
    text1: string;
    number1: number;
    code1: string;
}

const KyotsuTextInputDemoC: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            text1: '',
            number1: 0,
            code1: ''
        }
    });

    const onSubmit = (data: FormInputs) => {
        console.log('Form submitted:', data);
    };

    // 日本語のバリデーション（全角のみ）
    const validateJapanese = (value: string) => {
        return /^[一-龯ぁ-んァ-ン\s]*$/.test(value) || '全角文字のみ入力してください';
    };

    // 半角英数のバリデーション
    const validateAlphaNumeric = (value: string) => {
        return /^[a-zA-Z0-9]*$/.test(value) || '半角英数字のみ入力してください';
    };

    // 数値のバリデーション
    const validateNumber = (value: number) => {
        return !isNaN(value) || '数値を入力してください';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                KyotsuTextInput with React Hook Form (register)
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        日本語入力デモ
                    </Typography>
                    <KyotsuTextInputC
                        label="日本語入力"
                        type="0"
                        maxlength={20}
                        format="0"
                        inputmode="0"
                        {...register('text1', { validate: validateJapanese })}
                    />
                    {errors.text1 && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.text1.message}
                        </Typography>
                    )}
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        数値入力デモ
                    </Typography>
                    <KyotsuTextInputC
                        label="金額入力"
                        type="3"
                        maxlength={10}
                        moneyunit="2"
                        decimalplace={0}
                        unit="円"
                        {...register('number1', {
                            valueAsNumber: true,
                            validate: validateNumber
                        })}
                    />
                    {errors.number1 && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.number1.message}
                        </Typography>
                    )}
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        半角英数入力デモ
                    </Typography>
                    <KyotsuTextInputC
                        label="コード入力"
                        type="4"
                        maxlength={8}
                        format="1"
                        {...register('code1', { validate: validateAlphaNumeric })}
                    />
                    {errors.code1 && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.code1.message}
                        </Typography>
                    )}
                </Paper>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        送信
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => reset()}>
                        リセット
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default KyotsuTextInputDemoC; 
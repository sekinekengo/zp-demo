import React from 'react';
import { Typography, Paper, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import KyotsuTextInputD from './KyotsuTextInputD';

interface FormInputs {
    text1: string;
    number1: number;
    code1: string;
}

const KyotsuTextInputDemoD: React.FC = () => {
    const { control, handleSubmit, reset } = useForm<FormInputs>({
        defaultValues: {
            text1: '',
            number1: 0,
            code1: ''
        }
    });

    const onSubmit = (data: FormInputs) => {
        console.log('Form submitted:', data);
    };

    return (
        <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h4">
                KyotsuTextInput with React Hook Form (Built-in Controller)
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <Paper sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6">
                                日本語入力デモ
                            </Typography>
                            <KyotsuTextInputD
                                label="日本語入力"
                                type="0"
                                maxlength={20}
                                format="0"
                                inputmode="0"
                                name="text1"
                                control={control}
                            />
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6">
                                数値入力デモ
                            </Typography>
                            <KyotsuTextInputD
                                label="金額入力"
                                type="3"
                                maxlength={10}
                                moneyunit="2"
                                decimalplace={0}
                                unit="円"
                                name="number1"
                                control={control}
                            />
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6">
                                半角英数入力デモ
                            </Typography>
                            <KyotsuTextInputD
                                label="コード入力"
                                type="4"
                                maxlength={8}
                                format="1"
                                name="code1"
                                control={control}
                            />
                        </Stack>
                    </Paper>

                    <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="primary">
                            送信
                        </Button>
                        <Button type="button" variant="outlined" onClick={() => reset()}>
                            リセット
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
};

export default KyotsuTextInputDemoD; 
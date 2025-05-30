import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import KyotsuTextInputD from './KyotsuTextInputD';
import { validateJapanese, validateEmail } from '../validation-utils';

// フォームの型定義
interface FormValues {
    name: string;
    email: string;
    code: string;
    zipCode: string;
    phoneNumber: string;
}

const KyotsuTextInputDemoD = () => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            name: '',
            email: '',
            code: '',
            zipCode: '',
            phoneNumber: ''
        }
    });

    const onSubmit = (data: FormValues) => {
        console.log('フォーム送信データ:', data);
        alert(`フォーム送信成功:\n${JSON.stringify(data, null, 2)}`);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                SampleD: 内蔵Controller パターン
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Controllerを内蔵したコンポーネント実装です。型によるバリデーションとカスタムバリデーションの両方をサポートします。
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <KyotsuTextInputD<FormValues>
                            label="お名前（全角日本語）"
                            name="name"
                            control={control}
                            type="0" // 日本語バリデーション
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <KyotsuTextInputD<FormValues>
                            label="メールアドレス"
                            name="email"
                            control={control}
                            type="3" // メールアドレスバリデーション
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <KyotsuTextInputD<FormValues>
                            label="コード（半角英数字）"
                            name="code"
                            control={control}
                            type="2" // 半角英数字バリデーション
                            maxlength={10}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <KyotsuTextInputD<FormValues>
                            label="郵便番号"
                            name="zipCode"
                            control={control}
                            type="4" // 郵便番号バリデーション
                            placeholder="123-4567"
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <KyotsuTextInputD<FormValues>
                            label="電話番号"
                            name="phoneNumber"
                            control={control}
                            type="5" // 電話番号バリデーション
                            placeholder="03-1234-5678"
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            送信
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default KyotsuTextInputDemoD; 
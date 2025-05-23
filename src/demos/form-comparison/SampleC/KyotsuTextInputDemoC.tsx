import React from 'react';
import { Typography, Paper, Button, Stack, Box, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import KyotsuTextInputC from './KyotsuTextInputC';
import {
    validateJapanese,
    validateAlphaNumeric,
    validateEmail,
    validateZipCode,
    validatePhoneNumber
} from "../validation-utils";

interface FormValues {
    name: string;
    email: string;
    code: string;
    zipCode: string;
    phoneNumber: string;
}

const KyotsuTextInputDemoC: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
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
                SampleC: register + forwardRef パターン
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                register関数とforwardRefを使用した実装です。カスタムバリデーション関数を直接渡せます。
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <KyotsuTextInputC
                            label="お名前（全角日本語）"
                            {...register("name", {
                                required: "お名前は必須です",
                                validate: validateJapanese
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <KyotsuTextInputC
                            label="メールアドレス"
                            {...register("email", {
                                required: "メールアドレスは必須です",
                                validate: validateEmail
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <KyotsuTextInputC
                            label="コード（半角英数字）"
                            {...register("code", {
                                required: "コードは必須です",
                                validate: validateAlphaNumeric,
                                maxLength: {
                                    value: 10,
                                    message: "10文字以内で入力してください"
                                }
                            })}
                            error={!!errors.code}
                            helperText={errors.code?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <KyotsuTextInputC
                            label="郵便番号"
                            placeholder="123-4567"
                            {...register("zipCode", {
                                required: "郵便番号は必須です",
                                validate: validateZipCode
                            })}
                            error={!!errors.zipCode}
                            helperText={errors.zipCode?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <KyotsuTextInputC
                            label="電話番号"
                            placeholder="03-1234-5678"
                            {...register("phoneNumber", {
                                required: "電話番号は必須です",
                                validate: validatePhoneNumber
                            })}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
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

export default KyotsuTextInputDemoC; 
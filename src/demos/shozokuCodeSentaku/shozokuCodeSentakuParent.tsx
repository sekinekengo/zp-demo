import React, { useState } from 'react';
import {
    Box, Button,
    Typography, Paper, Container
} from '@mui/material';
import ShozokuCodeSentakuDialog from './shozokuCodeSentakuDialog';
import KyotsuDialog from '../../components/KyotsuDialog';

interface ShozokuData {
    code: string;
    name: string;
}

interface DialogInitialData {
    selectedCode?: string;
}

const ShozokuCodeSentakuParent: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedShozoku, setSelectedShozoku] = useState<ShozokuData | null>(null);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = (data?: ShozokuData) => {
        setIsDialogOpen(false);
        if (data && data.code !== '') {
            setSelectedShozoku(data);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>所属コード選択</Typography>
                <Button variant="contained" color="primary" onClick={openDialog}>
                    所属を選択する
                </Button>
            </Box>
            {selectedShozoku && (
                <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom>選択された所属</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="body1">コード: {selectedShozoku.code}</Typography>
                        <Typography variant="body1">名称: {selectedShozoku.name}</Typography>
                    </Box>
                </Paper>
            )}
            <KyotsuDialog<DialogInitialData, ShozokuData>
                openDialog={isDialogOpen}
                onCloseDialog={closeDialog}
                initialData={{ selectedCode: selectedShozoku?.code }}
            >
                <ShozokuCodeSentakuDialog />
            </KyotsuDialog>
        </Container>
    );
};

export default ShozokuCodeSentakuParent;

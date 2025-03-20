import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import KyotsuDataGrid from '../../components/KyotsuDataGrid';
import { DialogChildProps, DialogSize } from '../../components/KyotsuDialog';
import { Column, SortColumn, textEditor } from 'react-data-grid';

interface ShozokuData {
    code: string;
    name: string;
}

interface DialogInitialData {
    selectedCode?: string;
}

// ダミーデータを生成
const generateDummyData = (): ShozokuData[] => {
    const data: ShozokuData[] = [];
    for (let i = 1; i <= 100; i++) {
        const codePrefix = i <= 30 ? 'A' : i <= 60 ? 'B' : 'C';
        data.push({
            code: `${codePrefix}${String(i).padStart(3, '0')}`,
            name: `所属${codePrefix}${i}`,
        });
    }
    return data;
};

const ShozokuCodeSentakuDialog: React.FC<DialogChildProps<DialogInitialData, ShozokuData>> & {
    dialogSize?: DialogSize;
    dialogTitle?: string;
} = ({ onClose, initialData }) => {
    const [rows] = useState<ShozokuData[]>(generateDummyData());
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    // 選択された行への参照を保持するためのref
    const selectedRowRef = useRef<ShozokuData | null>(null);

    // カラム定義
    const columns = useMemo<Column<ShozokuData>[]>(() => [
        {
            key: 'code',
            name: '所属コード',
            width: 120,
            sortable: true,
            renderEditCell: textEditor,
        },
        {
            key: 'name',
            name: '所属名',
            width: 200,
            sortable: true,
            renderEditCell: textEditor,
        }
    ], []);

    // 初期選択行を設定（initialDataに基づく）
    const initialSelectedRow = useMemo(() => {
        if (initialData?.selectedCode) {
            return rows.find(row => row.code === initialData.selectedCode) || null;
        }
        return null;
    }, [rows, initialData]);

    // 選択ボタンクリック時のハンドラ
    const handleSelect = () => {
        if (selectedRowRef.current) {
            onClose?.(selectedRowRef.current);
        }
    };

    // キャンセルボタンクリック時のハンドラ
    const handleCancel = () => {
        if (onClose) {
            onClose({
                code: '',
                name: ''
            });
        }
    };

    // 選択行が変更された時のコールバック
    const handleRowSelected = useCallback((row: ShozokuData | null) => {
        // 必要に応じて追加の処理を行う場合はここに記述
        console.log('選択行が変更されました:', row);
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                所属コードを選択してください
            </Typography>

            <Box sx={{ flex: 1, minHeight: '400px', mb: 2 }}>
                <KyotsuDataGrid
                    columns={columns}
                    rows={rows}
                    rowKeyGetter={row => row.code}
                    sortColumns={sortColumns}
                    onSortColumnsChange={setSortColumns}
                    defaultColumnOptions={{
                        resizable: true,
                        minWidth: 100,
                    }}
                    showRowNumber={true}
                    useInternalSort={true}
                    rowSelectable={true}
                    initialSelectedRow={initialSelectedRow}
                    selectedRowRef={selectedRowRef}
                    onRowSelected={handleRowSelected}
                    clearSelectionOnSort={true}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleCancel}>
                    キャンセル
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelect}
                    disabled={!selectedRowRef.current}
                >
                    選択
                </Button>
            </Box>
        </Box>
    );
};

ShozokuCodeSentakuDialog.dialogSize = DialogSize.MD;
ShozokuCodeSentakuDialog.dialogTitle = '所属コード選択';

export default ShozokuCodeSentakuDialog;

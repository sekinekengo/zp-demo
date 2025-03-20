import React, { useState, useMemo, useCallback } from 'react';
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
} = ({ onClose }) => {
    const [rows] = useState<ShozokuData[]>(generateDummyData());
    const [selectedRow, setSelectedRow] = useState<ShozokuData | null>(null);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    // 選択された行のコード
    const selectedCode = selectedRow?.code || '';

    // カラム定義
    const columns = useMemo<Column<ShozokuData>[]>(() => [
        {
            key: 'code',
            name: '所属コード',
            width: 120,
            sortable: true,
            renderEditCell: textEditor,
            renderCell: ({ row }) => (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: row.code === selectedCode ? '#e3f2fd' : 'transparent'
                    }}
                    onClick={() => setSelectedRow(row)}
                >
                    {row.code}
                </div>
            )
        },
        {
            key: 'name',
            name: '所属名',
            width: 200,
            sortable: true,
            renderEditCell: textEditor,
            renderCell: ({ row }) => (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: row.code === selectedCode ? '#e3f2fd' : 'transparent'
                    }}
                    onClick={() => setSelectedRow(row)}
                >
                    {row.name}
                </div>
            )
        }
    ], [selectedCode]);

    // 選択ボタンクリック時のハンドラ
    const handleSelect = () => {
        if (selectedRow) {
            onClose?.(selectedRow);
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

    // ソート変更ハンドラ
    const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
        setSortColumns(sortColumns.slice(-1));
        // ソート時に選択を解除する
        setSelectedRow(null);
    }, []);

    // 行クリック時のハンドラ（行番号も含む）
    const handleRowClick = useCallback(({ row }: { row: ShozokuData }) => {
        setSelectedRow(row);
    }, []);

    // 行番号セルのレンダラー
    const rowNumberCellRenderer = useCallback(({ rowIdx, row }: { rowIdx: number, row: ShozokuData }) => (
        <div
            style={{
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: row.code === selectedCode ? '#e3f2fd' : 'var(--rdg-header-background-color)'
            }}
            onClick={() => setSelectedRow(row)}
        >
            {rowIdx + 1}
        </div>
    ), [selectedCode]);

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
                    onSortColumnsChange={onSortColumnsChange}
                    className="fill-grid"
                    defaultColumnOptions={{
                        resizable: true,
                        minWidth: 100,
                    }}
                    showRowNumber={true}
                    useInternalSort={true}
                    onRowClick={handleRowClick}
                    rowNumberCellRenderer={rowNumberCellRenderer}
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
                    disabled={!selectedRow}
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

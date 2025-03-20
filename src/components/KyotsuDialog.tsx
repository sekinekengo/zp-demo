import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";

/**
 * ダイアログのサイズを定義する列挙型
 * XS: 極小, SM: 小, MD: 中, LG: 大, XL: 特大
 */
// eslint-disable-next-line react-refresh/only-export-components
export enum DialogSize {
    XS = "xs",
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl",
}

/**
 * ダイアログの子コンポーネントに渡されるプロップスの型定義
 * @template TInitialData - ダイアログに渡す初期データの型
 * @template TReturnData - ダイアログから返されるデータの型
 */
export interface DialogChildProps<
    TInitialData = unknown,
    TReturnData = unknown
> {
    /** ダイアログを閉じる時に呼び出されるコールバック関数 */
    onClose?: (data: TReturnData) => void;
    /** ダイアログの初期化データ */
    initialData?: TInitialData;
    /** ダイアログのサイズ（オプション） */
    dialogSize?: DialogSize;
    /** ダイアログのタイトル（オプション） */
    dialogTitle?: string;
}

/**
 * KyotsuDialogコンポーネントのプロップスの型定義
 * @template TInitialData - ダイアログに渡す初期データの型
 * @template TReturnData - ダイアログから返されるデータの型
 */
export interface DialogProps<TInitialData = unknown, TReturnData = unknown> {
    /** ダイアログの開閉状態 */
    openDialog: boolean;
    /** ダイアログが閉じられた時に呼び出されるコールバック関数 */
    onCloseDialog: (data?: TReturnData) => void;
    /** ダイアログの初期化データ（オプション） */
    initialData?: TInitialData;
    /** ダイアログの子コンポーネント */
    children: React.ReactElement<DialogChildProps<TInitialData, TReturnData>>;
}

// 同時に開かれているダイアログの数を追跡するグローバル変数
let openDialogCount = 0;

/**
 * ダイアログサイズごとのスケーリング係数
 * 値が大きいほど、ダイアログは小さくなる
 */
const sizeToLevel: Record<DialogSize, number> = {
    [DialogSize.XS]: 4,
    [DialogSize.SM]: 1.5,
    [DialogSize.MD]: 1.2,
    [DialogSize.LG]: 1,
    [DialogSize.XL]: 0,
};

/**
 * 汎用的なダイアログコンポーネント
 * 複数のダイアログを重ね合わせて表示することができ、最前面のダイアログのみ背景が表示される
 *
 * @template TInitialData - ダイアログに渡す初期データの型（デフォルト: unknown）
 * @template TReturnData - ダイアログから返されるデータの型（デフォルト: unknown）
 */
function KyotsuDialog<TInitialData = unknown, TReturnData = unknown>({
    openDialog,
    onCloseDialog,
    initialData,
    children,
}: DialogProps<TInitialData, TReturnData>) {
    // ダイアログが最前面にあるかどうかの状態
    const [isTopMost, setIsTopMost] = useState(true);
    const backdropRef = useRef<HTMLDivElement | null>(null);

    // 子コンポーネントから dialogSize と dialogTitle を取得
    const childType = children.type as React.FC<
        DialogChildProps<TInitialData, TReturnData>
    > & {
        dialogSize?: DialogSize;
        dialogTitle?: string;
    };

    // 子コンポーネントの設定、または既定値を使用
    const size = childType.dialogSize || DialogSize.MD;
    const title = childType.dialogTitle || "";
    const level = sizeToLevel[size];

    /**
     * ダイアログが開かれたときの効果
     * - ダイアログカウントを増やす
     * - 以前のダイアログの背景を透明にする
     * - クリーンアップ時にカウントを減らし、適切な背景表示を復元する
     */
    useEffect(() => {
        if (openDialog) {
            openDialogCount++;
            const currentCount = openDialogCount;

            if (currentCount > 1) {
                // 2つ目以降のダイアログが開かれた場合、前のダイアログの背景を透明にする
                const prevDialog = document.querySelector('.dialog-backdrop:not(.transparent)') as HTMLElement;
                if (prevDialog) {
                    prevDialog.classList.add("transparent");
                }
            }
            setIsTopMost(true);

            return () => {
                // ダイアログが閉じられたときのクリーンアップ
                openDialogCount--;
                if (openDialogCount > 0) {
                    // まだ他のダイアログが開いている場合、一つ前のダイアログの背景を元に戻す
                    const prevDialog = document.querySelector(".dialog-backdrop.transparent") as HTMLElement;
                    if (prevDialog) {
                        prevDialog.classList.remove("transparent");
                    }
                }
                setIsTopMost(false);
            };
        }
    }, [openDialog]);

    /**
     * ダイアログを閉じるハンドラ
     * 子コンポーネントのonCloseを呼び出し、その後親コンポーネントのonCloseDialogを呼び出す
     */
    const handleClose = (data?: TReturnData) => {
        if (React.isValidElement(children)) {
            const childProps = children.props as {
                onClose?: (data?: TReturnData) => void;
            };
            if (typeof childProps.onClose === "function") {
                childProps.onClose(data);
            }
        }
        onCloseDialog(data);
    };

    // 子コンポーネントに必要なプロパティを追加
    const childrenWithProps = React.cloneElement(children, {
        onClose: handleClose,
        initialData,
    });

    return (
        <Dialog
            open={openDialog}
            onClose={() => handleClose()}
            fullWidth
            maxWidth={size}
            BackdropProps={{
                ref: backdropRef,
                className: isTopMost
                    ? "dialog-backdrop"
                    : "dialog-backdrop transparent",
            }}
            slotProps={{
                paper: {
                    style: {
                        top: "16px",
                        width: `calc(95% - ${level * 40}px)`,
                        height: `calc(90% - ${level * 40}px)`,
                        margin: "20px",
                        backgroundColor: "#eeeeee",
                    },
                },
            }}
        >
            {title && (
                <DialogTitle sx={{ ml: 2, mt: 0.5, p: 0 }}>{title}</DialogTitle>
            )}
            <DialogContent
                dividers
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
                <div style={{ flex: 1, overflow: "auto" }}>{childrenWithProps}</div>
            </DialogContent>
        </Dialog>
    );
}

export default KyotsuDialog;

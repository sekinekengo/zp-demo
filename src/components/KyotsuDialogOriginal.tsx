import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";


export enum DialogSize {
    XS = "xs",
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl",
}

export interface DialogChildProps<TInitialData, TReturnData> {
    onClose: (data: TReturnData) => void;
    initialData: TInitialData;
    dialogSize?: DialogSize;
    dialogTitle?: string;
}

export interface DialogProps<TInitialData, TReturnData> {
    openDialog: boolean;
    onCloseDialog: (data?: TReturnData) => void;
    initialData?: TInitialData;
    children: React.ReactElement<DialogChildProps<TInitialData, TReturnData>>;
}

let openDialogCount = 0;

const sizeToLebel: Record<DialogSize, number> = {
    [DialogSize.XS]: 4,
    [DialogSize.SM]: 1.5,
    [DialogSize.MD]: 1.2,
    [DialogSize.LG]: 1,
    [DialogSize.XL]: 0,
}

function KyotsuDialog<TInitialData = any, TReturnData = any>({
    openDialog,
    onCloseDialog,
    initialData,
    children,
}: DialogProps<TInitialData, TReturnData>) {
    const [isTopMost, setIsTopMost] = useState(true);
    const backdropRef = useRef<HTMLDivElement | null>(null);

    // 子コンポーネントから dialogSize と dialogTitle を取得
    const childType = children.type as React.FC<DialogChildProps<TInitialData, TReturnData>> & {
        dialogSize?: DialogSize;
        dialogTitle?: string;
    };

    const size = childType.dialogSize || DialogSize.MD;
    const title = childType.dialogTitle || "";
    const level = sizeToLebel[size];

    useEffect(() => {
        if (openDialog) {
            openDialogCount++;
            const currentCount = openDialogCount;

            if (currentCount === 1) {
                const prevDialog = document.querySelector('.dialog-backdrop:not(.transparent)') as HTMLElement;
                if (prevDialog) {
                    prevDialog.classList.add('transparent');
                }
            }
            setIsTopMost(true);

            return () => {
                openDialogCount--;
                if (openDialogCount > 0) {
                    const prevDialog = document.querySelector('.dialog-backdrop.transparent') as HTMLElement;
                    if (prevDialog) {
                        prevDialog.classList.remove('transparent');
                    }
                }
                setIsTopMost(false);
            };
        };
    }, [openDialog]);

    const handleClose = (data?: TReturnData) => {
        if (React.isValidElement(children)) {
            const childProps = children.props as { onClose?: (data?: TReturnData) => void };
            if (typeof childProps.onClose === 'function') {
                childProps.onClose(data);
            }
        }
        onCloseDialog(data);
    };

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
                className: isTopMost ? 'dialog-backdrop' : 'dialog-backdrop transparent',
            }}
            slotProps={{
                paper: {
                    style: {
                        top: '16px',
                        width: `calc(95% - ${level * 40}px)`,
                        height: `calc(90% - ${level * 40}px)`,
                        margin: '20px',
                        backgroundColor: '#eeeeee',
                    }
                }
            }}
        >
            {title && <DialogTitle sx={{ ml: 2, mt: 0.5, p: 0 }}>{title}</DialogTitle>}
            <DialogContent dividers style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {childrenWithProps}
                </div>
            </DialogContent>
        </Dialog>
    );
}
export default KyotsuDialog;
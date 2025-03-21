import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { ContextMenuState, ContextMenuOptions } from "./types";
import { contextMenuStyle, menuItemStyle, menuItemHoverStyle, menuItemDisabledStyle } from "./styles";

interface ContextMenuProps<R extends object> {
    contextMenu: ContextMenuState | null;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState | null>>;
    contextMenuOptions: ContextMenuOptions;
    copiedRow: R | null;
    onCopyRow: () => void;
    onPasteRow: () => void;
    onDeleteRow: () => void;
    onAddRowBelow: () => void;
    onAddRowToBottom: () => void;
    hasCreateEmptyRow: boolean;
}

/**
 * コンテキストメニューコンポーネント
 */
function ContextMenu<R extends object>({
    contextMenu,
    setContextMenu,
    contextMenuOptions,
    copiedRow,
    onCopyRow,
    onPasteRow,
    onDeleteRow,
    onAddRowBelow,
    onAddRowToBottom,
    hasCreateEmptyRow
}: ContextMenuProps<R>) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const menuRef = useRef<HTMLUListElement>(null);
    const initialRenderRef = useRef(true);

    // ペースト機能の有効状態
    const isPasteEnabled = contextMenuOptions.pasteRow && copiedRow !== null;

    // コンテキストメニューの外側クリック時のクローズ処理
    useEffect(() => {
        if (!contextMenu) return;

        function onClick(event: MouseEvent) {
            if (
                event.target instanceof Node &&
                menuRef.current?.contains(event.target)
            ) {
                return;
            }
            setContextMenu(null);
        }

        window.addEventListener("click", onClick);
        return () => {
            window.removeEventListener("click", onClick);
        };
    }, [contextMenu, setContextMenu]);

    // コンテキストメニューの位置調整
    useLayoutEffect(() => {
        if (contextMenu === null) {
            setMenuPosition(null);
            initialRenderRef.current = true;
            return;
        }

        // 初期表示時はcontextMenuの位置をそのまま使用
        if (initialRenderRef.current) {
            setMenuPosition({ top: contextMenu.top, left: contextMenu.left });
            initialRenderRef.current = false;
            return;
        }

        // メニューの要素が存在する場合、画面からはみ出さないように調整
        if (menuRef.current) {
            let top = contextMenu.top;
            let left = contextMenu.left;

            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 右側がはみ出す場合
            if (left + menuRect.width > viewportWidth) {
                left = viewportWidth - menuRect.width - 10; // 10pxの余白
            }

            // 下側がはみ出す場合
            if (top + menuRect.height > viewportHeight) {
                top = viewportHeight - menuRect.height - 10; // 10pxの余白
            }

            // 位置が負にならないように調整
            if (left < 0) left = 10;
            if (top < 0) top = 10;

            setMenuPosition({ top, left });
        }
    }, [contextMenu]);

    if (contextMenu === null) return null;

    return createPortal(
        <ul
            ref={menuRef}
            style={{
                ...contextMenuStyle,
                top: menuPosition?.top ?? 0,
                left: menuPosition?.left ?? 0,
                visibility: menuPosition ? "visible" : "hidden",
            }}
            className="context-menu"
        >
            {contextMenuOptions.copyRow && (
                <li
                    style={
                        hoveredItem === "copy" ? menuItemHoverStyle : menuItemStyle
                    }
                    onMouseEnter={() => setHoveredItem("copy")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={onCopyRow}
                >
                    行をコピー
                </li>
            )}
            {contextMenuOptions.pasteRow && (
                <li
                    style={
                        copiedRow === null
                            ? menuItemDisabledStyle
                            : hoveredItem === "paste"
                                ? menuItemHoverStyle
                                : menuItemStyle
                    }
                    onMouseEnter={() => isPasteEnabled && setHoveredItem("paste")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={isPasteEnabled ? onPasteRow : undefined}
                >
                    行をペースト
                </li>
            )}
            {contextMenuOptions.deleteRow && (
                <li
                    style={
                        hoveredItem === "delete" ? menuItemHoverStyle : menuItemStyle
                    }
                    onMouseEnter={() => setHoveredItem("delete")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={onDeleteRow}
                >
                    行を削除
                </li>
            )}
            {contextMenuOptions.addRowBelow && hasCreateEmptyRow && (
                <li
                    style={
                        hoveredItem === "addBelow"
                            ? menuItemHoverStyle
                            : menuItemStyle
                    }
                    onMouseEnter={() => setHoveredItem("addBelow")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={onAddRowBelow}
                >
                    下に行を挿入
                </li>
            )}
            {contextMenuOptions.addRowToBottom && hasCreateEmptyRow && (
                <li
                    style={
                        hoveredItem === "addBottom"
                            ? menuItemHoverStyle
                            : menuItemStyle
                    }
                    onMouseEnter={() => setHoveredItem("addBottom")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={onAddRowToBottom}
                >
                    最下部に行を追加
                </li>
            )}
        </ul>,
        document.body
    );
}

export default ContextMenu; 
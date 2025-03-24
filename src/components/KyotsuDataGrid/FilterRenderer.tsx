import React, { useCallback } from 'react';
import { FilterRendererProps } from './types';
import { filterCellStyle, filterInputStyle } from './styles';

/**
 * フィルタレンダラーコンポーネント
 * 各列のヘッダーに表示されるフィルタ入力フィールド
 */
function FilterRenderer({ columnKey, value, onChange }: FilterRendererProps) {
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange]
    );

    return (
        <div style={filterCellStyle}>
            <input
                value={value}
                onChange={handleChange}
                style={filterInputStyle}
                placeholder={`${columnKey}でフィルター`}
                aria-label={`${columnKey}で検索`}
            />
        </div>
    );
}

export default FilterRenderer; 
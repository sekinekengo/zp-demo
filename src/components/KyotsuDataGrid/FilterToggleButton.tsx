import React from 'react';
import { filterToggleButtonStyle, filterToggleButtonActiveStyle } from './styles';

interface FilterToggleButtonProps {
    showFilters: boolean;
    onClick: () => void;
}

/**
 * フィルター切り替えボタン
 * フィルターの表示/非表示を切り替えるためのボタン
 */
const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({ showFilters, onClick }) => {
    return (
        <button
            type="button"
            style={showFilters ? filterToggleButtonActiveStyle : filterToggleButtonStyle}
            onClick={onClick}
        >
            {showFilters ? 'フィルター非表示' : 'フィルター表示'}
        </button>
    );
};

export default FilterToggleButton; 
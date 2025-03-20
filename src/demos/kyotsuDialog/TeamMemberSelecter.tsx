import React, { useState } from 'react';
import { Button, Typography, Paper, Container, List, ListItem, ListItemText, Grid } from '@mui/material';
// KyotsuDialogモジュールが見つからないため、インポートをコメントアウト
// import { DialogChildProps } from '../../../components/KyotsuDialog';

interface TeamMember {
    name: string;
    role: string;
}

// DepartmentDataの型定義を修正
type DepartmentType = "営業" | "開発" | "設計";

interface DepartmentData {
    department: DepartmentType;
}

const departmentMembers: Record<DepartmentType, TeamMember[]> = {
    "営業": [
        { name: "佐藤", role: "営業マネージャー" },
        { name: "田中", role: "アカウントエグゼクティブ" },
        { name: "高橋", role: "セールスレップ" },
    ],
    "開発": [
        { name: "山本", role: "開発マネージャー" },
        { name: "小林", role: "ソフトウェアエンジニア" },
        { name: "加藤", role: "ソフトウェアエンジニア" },
    ],
    "設計": [
        { name: "中村", role: "デザインマネージャー" },
        { name: "松本", role: "UI/UXデザイナー" },
        { name: "渡辺", role: "グラフィックデザイナー" },
    ],
};

// React.memoの使い方を修正し、パラメータ名の不一致を解決
const SalesTeamSelector = React.memo(({ onSelect }: { onSelect: (member: TeamMember) => void }) => {
    return (
        <Grid container spacing={2}>
            {departmentMembers["営業"].map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Button variant="outlined" onClick={() => onSelect(member)}>
                        {member.name} ({member.role})
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
});

export default SalesTeamSelector;

